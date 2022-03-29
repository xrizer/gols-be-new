const Joi = require('joi');
const {
    userLoginHandler,
    userAuthHandler,
    addHospitalHandler,
    getListHospitalHandler,
    getDetailHospitalHandler,
    updateHospitalHandler,
    deleteHospitalHandler,
    addInvoiceHandler,
    getListInvoiceHandler,
    getDetailInvoiceHandler,
    updateInvoiceHandler,
    addPromoHandler,
    getListPromoHandler,
    getDetailPromoHandler,
    updatePromoHandler,
    getCostHandler,
    getTrackHandler,
    getCheckPromoHandler,
} = require('./handler');

const routes = [
    // AUTHENTICATION
    { // Untuk login di halaman login #admin,cs,pasien
        method: 'POST',
        path: '/api/login', // Filter role yang dimasuki via payload
        handler: userLoginHandler,
        options: {
            payload: {
                multipart: true,
            },
            validate: {
                payload: Joi.object({
                    login: Joi.string().min(1).max(50).required(),
                    pin: Joi.number().integer().min(100000).max(999999).required(),
                    role: Joi.string().required(),
                })
            }
        },
    },
    { // Untuk autentikasi token di halaman splash # admin,cs
        method: 'GET',
        path: '/api/auth',
        handler: userAuthHandler,
        options: {
        },
    },
    // //HOSPITAL
    { // Untuk halaman tambah RS #admin
        method: 'POST',
        path: '/api/hospital',
        handler: addHospitalHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    { // Untuk list RS di halaman kelola RS #admin
        method: 'GET',
        path: '/api/hospital', // Filter is_cs via payload
        handler: getListHospitalHandler,
        options: {
        },
    },
    { // Untuk detail RS di halaman kelola RS #admin
        method: 'GET',
        path: '/api/hospital/{id}', // Filter is_cs via payload
        handler: getDetailHospitalHandler,
        options: {
        },
    },
    { // Untuk update RS di halaman detail RS #admin
        method: 'PUT',
        path: '/api/hospital/{id}',
        handler: updateHospitalHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    { // Untuk delete RS di halaman detail RS #admin
        method: 'DELETE',
        path: '/api/hospital/{id}',
        handler: deleteHospitalHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    // //INVOICE
    { // Untuk count cost di halaman add invoice #pasien
        method: 'GET',
        path: '/api/cost',
        handler: getCostHandler,
        options: {
        },
    },
    { // Untuk add invoice di halaman add invoice #pasien
        method: 'POST',
        path: '/api/invoice',
        handler: addInvoiceHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    { // Untuk list invoice di halaman list invoice #admin,cs
        method: 'GET',
        path: '/api/invoice', // Filter id_user via token
        handler: getListInvoiceHandler,
        options: {
        },
    },
    { // Untuk detail invoice di halaman detail invoice #admin,cs
        method: 'GET',
        path: '/api/invoice/{id}',
        handler: getDetailInvoiceHandler,
        options: {
        },
    },
    { // Untuk update invoice di halaman detail invoice #admin,cs
        method: 'PUT',
        path: '/api/invoice/{id}',
        handler: updateInvoiceHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    { // Untuk update promo di halaman detail promo #admin
        method: 'GET',
        path: '/api/track/{resi}',
        handler: getTrackHandler,
        options: {
        },
    },
    // { // Untuk update promo di halaman detail promo #admin
    //     method: 'GET',
    //     path: '/api/recap',
    //     handler: getTransactionRecapHandler,
    //     options: {
    //     },
    // },
    // // PROMO
    { // Untuk add promo di halaman promo #admin
        method: 'POST',
        path: '/api/promo',
        handler: addPromoHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    { // Untuk list promo di halaman promo #admin
        method: 'GET',
        path: '/api/promo', // Filter active or inactive via payload
        handler: getListPromoHandler,
        options: {
        },
    },
    { // Untuk detail promo di halaman detail promo #admin
        method: 'GET',
        path: '/api/promo/{id}',
        handler: getDetailPromoHandler,
        options: {
        },
    },
    { // Untuk update promo di halaman detail promo #admin
        method: 'PUT',
        path: '/api/promo/{id}',
        handler: updatePromoHandler,
        options: {
            payload: {
                multipart: true,
            },
        },
    },
    { // Untuk detail promo di halaman detail promo #admin
        method: 'GET',
        path: '/api/check_promo/{kode_promo}',
        handler: getCheckPromoHandler,
        options: {
        },
    },
];

module.exports = routes;