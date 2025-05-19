const cds = require('@sap/cds')

module.exports = async (srv) => {
    const ECPersonalInformation = await cds.connect.to('ECPersonalInformation')
    const ECTimeOff = await cds.connect.to('ECTimeOff')

    const { PerPersonal, TimeType, TimeAccount, EmployeeTime } = srv.entities

    // Util: Format date to OData style
    const toODataDate = (val) => {
        const date = new Date(val)
        if (isNaN(date.getTime())) throw new Error(`Invalid date: ${val}`)
        return `/Date(${date.getTime()})/`
    }

    // --- EMPLOYEE TIME ---

    srv.on('CREATE', EmployeeTime, async (req) => {
        try {
            const allowedFields = ['externalCode', 'userId', 'timeType', 'startDate', 'endDate']
            const mandatoryFields = ['externalCode', 'userId', 'timeType', 'startDate', 'endDate']

            const payload = {}

            for (const field of allowedFields) {
                if (req.data[field] !== undefined) {
                    payload[field] = req.data[field]
                }
            }

            for (const field of mandatoryFields) {
                if (!payload[field]) {
                    throw new Error(`Missing mandatory field: ${field}`)
                }
            }

            // Add navigation properties
            payload.timeTypeNav = { externalCode: payload.timeType }
            payload.userIdNav = { userId: payload.userId }

            // Format date fields
            for (const dateField of ['startDate', 'endDate']) {
                if (payload[dateField]) {
                    payload[dateField] = toODataDate(payload[dateField])
                }
            }

            const created = await ECTimeOff.tx(req).send({
                method: 'POST',
                path: 'EmployeeTime',
                data: payload
            })

            return created
        } catch (err) {
            console.error('CREATE EmployeeTime failed:', err)
            req.error(err.response?.status || 500, `Failed to create EmployeeTime: ${err.message}`)
        }
    })

    srv.on('READ', EmployeeTime, async (req) => {
        try {
            const query = { SELECT: req.query.SELECT }

            const employeeTimes = await ECTimeOff.tx(req).send({ query })
            const list = Array.isArray(employeeTimes) ? employeeTimes : [employeeTimes]

            for (const item of list) {
                item.customLabel = null
            }

            if (req.query.SELECT.count) {
                list['$count'] = list.length < 30 ? list.length : 1000
            }

            return list
        } catch (err) {
            console.error('READ EmployeeTime failed:', err)
            req.error(500, `Failed to fetch EmployeeTime: ${err.message}`)
        }
    })

    // --- PER PERSONAL ---
    srv.on('READ', PerPersonal, async (req) => {
        const query = SELECT.from(req.query.SELECT.from).limit(req.query.SELECT.limit)

        if (req.query.SELECT.where) query.where(req.query.SELECT.where)
        if (req.query.SELECT.orderBy) query.orderBy(req.query.SELECT.orderBy)

        const data = await ECPersonalInformation.tx(req).send({ query })

        const list = Array.isArray(data) ? data : [data]

        const extended = await Promise.all(list.map(async (item) => {
            const local = await SELECT.from(PerPersonal).where({ id: item.id })
            item.middelName = local[0]?.middelName || null
            return item
        }))

        if (req.query.SELECT.count) {
            extended['$count'] = extended.length < 30 ? extended.length : 1000
        }

        return extended
    })

    // --- TIME TYPE ---
    srv.on('READ', TimeType, async (req) => {
        const query = SELECT.from(req.query.SELECT.from).limit(req.query.SELECT.limit)

        if (req.query.SELECT.where) query.where(req.query.SELECT.where)
        if (req.query.SELECT.orderBy) query.orderBy(req.query.SELECT.orderBy)

        const data = await ECTimeOff.tx(req).send({ query })
        const list = Array.isArray(data) ? data : [data]

        for (const item of list) {
            item.customLabel = null
        }

        if (req.query.SELECT.count) {
            list['$count'] = list.length < 30 ? list.length : 1000
        }

        return list
    })

    srv.on('CREATE', TimeType, async (req) => {
        try {
            const created = await ECTimeOff.tx(req).send({
                method: 'POST',
                path: 'TimeType',
                data: req.data
            })

            return created
        } catch (err) {
            console.error('CREATE TimeType failed:', err)
            req.error(500, `Failed to create TimeType: ${err.message}`)
        }
    })

    // --- TIME ACCOUNT ---
    srv.on('READ', TimeAccount, async (req) => {
        try {
            const query = { SELECT: req.query.SELECT }
            const data = await ECTimeOff.tx(req).send({ query })

            const list = Array.isArray(data) ? data : [data]

            for (const item of list) {
                item.customLabel = null
            }

            if (req.query.SELECT.count) {
                list['$count'] = list.length < 30 ? list.length : 1000
            }

            return list
        } catch (err) {
            console.error('READ TimeAccount failed:', err)
            req.error(500, `Failed to fetch TimeAccount: ${err.message}`)
        }
    })

    srv.on('CREATE', TimeAccount, async (req) => {
        try {
            const payload = { ...req.data }

            for (const dateField of [
                'startDate', 'endDate',
                'bookingStartDate', 'bookingEndDate',
                'mdfSystemEffectiveStartDate', 'mdfSystemEffectiveEndDate'
            ]) {
                if (payload[dateField]) {
                    payload[dateField] = toODataDate(payload[dateField])
                }
            }

            if (payload.userIdNav?.startDate) {
                payload.userIdNav.startDate = toODataDate(payload.userIdNav.startDate)
            }

            const result = await ECTimeOff.tx(req).send({
                method: 'POST',
                path: 'TimeAccount',
                data: payload
            })

            return result
        } catch (err) {
            console.error('CREATE TimeAccount failed:', err.message)
            req.error(500, `Failed to create TimeAccount: ${err.message}`)
        }
    })
}
