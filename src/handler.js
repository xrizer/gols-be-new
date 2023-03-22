const options = require('./knex');
const knex = require('knex')(options);
const bcrypt = require('bcrypt');
const saltRounds = 10;
const gpc = require('generate-pincode');
const pin = gpc(6);
const {
  getAuth,
  setToken,
} = require('./jwt');
const { response } = require('@hapi/hapi/lib/validation');
const { Knex } = require('knex');

const userLoginHandler = (request, h) => {
  const {
    login,
    pin,
    role,
  } = request.payload;

  if (role == 'admin') {

    return knex('user')
      .where({ role: role })
      .andWhere({ username: login })
      .select()
      .then((results) => {

        if (!results || results.length == 0) {

          const response = h.response({
            error: 'NULL_DATA',
            message: 'Data admin tidak ditemukan',
            statusCode: 200,
          });
          response.code(200);
          return response;

        } else {

          if (pin.toString() == results[0].pin) {

            const userData = {
              id: results[0].id,
              username: results[0].username,
              nama: results[0].nama,
            };

            const tokenFormat = {
              role,
              detail_user: userData,
            };

            const token = setToken(tokenFormat);

            const responseFormat = {
              role,
              detail_user: userData,
            }

            const response = h.response({
              error: '-',
              message: 'Berhasil login sebagai admin',
              statusCode: 200,
              token,
              detail_login: responseFormat,
            });
            response.code(200);
            return response;

          } else {

            const response = h.response({
              error: 'WRONG_PASSWORD',
              message: 'Password Salah',
              statusCode: 200,
            });
            response.code(200);
            return response;

          }



        }
      }).catch((err) => {

        const response = h.response({
          error: err,
          message: 'Internal server error',
          statusCode: 500,
        });
        response.code(500);
        return response;

      });

  } else {

    return knex('rs')
      .where({ kode_rs: login })
      .select()
      .then((results) => {

        if (!results || results.length == 0) {

          const response = h.response({
            error: 'NULL_DATA',
            message: 'Data rumah sakit tidak ditemukan',
            statusCode: 200,
          });
          response.code(200);
          return response;

        } else {

          if (pin.toString() == results[0].pin) {

            if (!results[0].is_cs && role == 'cs') {

              const response = h.response({
                error: 'FORBIDDEN',
                message: 'Tidak terdapat data CS pada ' + results[0].nama_rs,
                statusCode: 200,
              });
              response.code(200);
              return response;

            } else {

              const rsData = {
                id: results[0].id,
                kode_rs: results[0].kode_rs,
                is_cs: results[0].is_cs,
                nama_rs: results[0].nama_rs,
                alamat_rs: results[0].alamat_rs,
                long_rs: results[0].long_rs,
                lat_rs: results[0].lat_rs,
                font_size: results[0].font_size,

              };

              const tokenFormat = {
                role,
                detail_rs: rsData,
              };

              const token = setToken(tokenFormat);

              const responseFormat = {
                role,
                detail_rs: rsData,
              }

              const app = (role == 'cs') ? 'sebagai CS pada akun ' + results[0].nama_rs : 'pada akun ' + results[0].nama_rs;

              const response = h.response({
                error: '-',
                message: 'Berhasil login ' + app,
                statusCode: 200,
                token,
                detail_login: responseFormat,
              });
              response.code(200);
              return response;

            }

          } else {

            const response = h.response({
              error: 'WRONG_PASSWORD',
              message: 'Password Salah',
              statusCode: 200,
            });
            response.code(200);
            return response;

          }


        }

      }).catch((err) => {

        const response = h.response({
          error: err.code,
          message: 'Internal server error',
          statusCode: 500,
        });
        response.code(500);
        return response;

      });

  }

};

const userAuthHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  const response = h.response({
    error: '-',
    message: 'Detail login berhasil ditemukan dan valid',
    statusCode: 200,
    detail_login: authData,
  });
  response.code(200);
  return response;

};

const addHospitalHandler = async (request, h) => {
  console.log(request.payload)
  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }


  const checkKode = await knex('rs')
    .select()
    .where('kode_rs', '=', request.payload.kode_rs)
    .then((results) => {

      if (!results || results.length == 0) {
        return true;
      } else {
        return false;
      }
    })

  if (!checkKode) {
    const response = h.response({
      error: 'Duplicate Entry',
      message: 'Kode rumah sakit sudah ada',
      statusCode: 200,
    });
    response.code(200);
    return response;
  }

  const newRecord = request.payload;

  if (!request.payload.pin) {
    newRecord.pin = pin;
  }



  return await knex('rs')
    .insert(newRecord)
    .then((results) => {

      newRecord.record_id = results[0];

      const response = h.response({
        error: '-',
        message: 'Data rumah sakit berhasil ditambahkan',
        statusCode: 201,
      });
      response.code(201);
      return response;


    }).catch((err) => {

      const response = h.response({
        error: err.code,
        message: err.message,
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getListHospitalHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('rs')
    .select('rs.id', 'rs.kode_rs', 'rs.is_cs', 'rs.nama_rs', knex.raw('COALESCE(`transaksi`.`num_progress`, 0 ) as ??', ['num_progress']), 'rs.updated_at')
    .leftJoin(
      knex('transaksi')
        .select('rs_id', knex.raw('count(*) as ??', ['num_progress']))
        .groupBy('rs_id').as('transaksi'),
      'transaksi.rs_id',
      'rs.id'
    )
    .where('rs.is_cs', '=', request.query.cs)
    .andWhere('rs.nama_rs', 'like', '%' + request.query.nama_rs + '%')
    .orderBy('updated_at', 'desc')
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Daftar rumah sakit tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Daftar rumah sakit ditemukan',
          statusCode: 200,
          list_rs: results,
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

  // return knex('rs')
  //   .where({ is_cs: request.query.cs })
  //   .andWhere('nama_rs','like','%'+request.query.nama_rs+'%')
  //   .select('id', 'kode_rs', 'is_cs', 'nama_rs')
  //   .then((results) => {

  //     if (!results || results.length == 0) {

  //       const response = h.response({
  //         error: 'NULL_DATA',
  //         message: 'Daftar rumah sakit tidak ditemukan',
  //         statusCode: 200,
  //       });
  //       response.code(200);
  //       return response;

  //     } else {

  //       const response = h.response({
  //         error: '-',
  //         message: 'Daftar rumah sakit ditemukan',
  //         statusCode: 200,
  //         list_rs: results,
  //       });
  //       response.code(200);
  //       return response;

  //     }

  //   }).catch((err) => {

  //     const response = h.response({
  //       error: err,
  //       message: 'Internal server error',
  //       statusCode: 500,
  //     });
  //     response.code(500);
  //     return response;

  //   });

}

const getDetailHospitalHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('rs')
    .where({ id: request.params.id })
    .select('id', 'kode_rs', 'is_cs', 'nama_rs', 'alamat_rs', 'long_rs', 'lat_rs', 'font_size', 'pin')
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Detail rumah sakit tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Detail rumah sakit ditemukan',
          statusCode: 200,
          detail_rs: results[0],
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const updateHospitalHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('rs')
    .where({ id: request.params.id })
    .update(request.payload)
    .then((results) => {

      const response = h.response({
        error: '-',
        message: 'Data rumah sakit berhasil diubah',
        statusCode: 201,
      });
      response.code(201);
      return response;

    })
    .catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const deleteHospitalHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('rs')
    .where({ id: request.params.id })
    .del()
    .then((results) => {

      const response = h.response({
        error: '-',
        message: 'Data rumah sakit berhasil dihapus',
        statusCode: 201,
      });
      response.code(201);
      return response;

    })
    .catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const addInvoiceHandler = async (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  const req = request.payload;
  req.rs_id = authData.detail_rs.id
  const addInvoice = await knex('transaksi')
    .insert(req)
    .then((results) => {

      return {
        error: '-',
        message: 'Berhasil',
        statusCode: 201,
        id: results[0],
      }

    }).catch((err) => {

      return {
        error: err.code,
        message: 'Internal server error',
        statusCode: 500,
      }

    });


  if (addInvoice.statusCode == 201) {

    var listRiwayat = '';

    if (request.payload.metode_bayar == 'Tunai') {
      listRiwayat = [
        { transaksi_id: addInvoice.id, detail_riwayat: 'Menunggu pembayaran' },
      ];
    } else if (request.payload.metode_bayar == 'QRIS') {
      listRiwayat = [
        { transaksi_id: addInvoice.id, detail_riwayat: 'Menunggu pembayaran' },
        { transaksi_id: addInvoice.id, detail_riwayat: 'Pembayaran lunas' },
      ];
    }

    return await knex('riwayat')
      .insert(listRiwayat)
      .then((results) => {

        const response = h.response({
          error: '-',
          message: 'Data transaksi beserta riwayat berhasil ditambahkan',
          statusCode: 201,
        });
        response.code(201);
        return response;

      }).catch((err) => {

        const response = h.response({
          error: err.code,
          message: err.message,
          statusCode: 500,
        });
        response.code(500);
        return response;

      });
  } else {
    const response = h.response(addInvoice);
    response.code(addInvoice.statusCode);
    return response;
  }

}

const getListInvoiceHandler = (request, h) => {
  
  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  // const filter = (authData.role == 'admin') ? { field: 'rs.id', data: request.query.rs_id } : { field: 'rs.id', data: authData.detail_rs.id };

  const status = (request.query.status) ? request.query.status : '';

  return knex('rs')
    .select('transaksi.id', 'transaksi.rs_id', 'transaksi.updated_at', 'transaksi.nama_pasien', 'transaksi.no_resi', 'transaksi.status', 'rs.is_cs', 'transaksi.updated_at')
    .rightJoin('transaksi', 'rs.id', 'transaksi.rs_id')
    .where('rs_id', '=', request.query.rs_id)
    .andWhere('status', 'like', '%' + status + '%')
    .orderBy('updated_at', 'desc')
    .then((results) => {

      if (!results || results.length == 0) {
        const response = h.response({
          error: 'NULL_DATA',
          message: 'Daftar transaksi tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {
        const response = h.response({
          error: '-',
          message: 'Daftar transaksi ditemukan',
          statusCode: 200,
          list_transaksi: results,
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err.message,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getDetailInvoiceHandler = async (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  const detailInvoice = await knex('rs')
    .select('transaksi.*', 'rs.nama_rs', 'rs.alamat_rs')
    .rightJoin('transaksi', 'rs.id', 'transaksi.rs_id')
    .where('transaksi.id', '=', request.params.id)
    .then((results) => {

      if (!results || results.length == 0) {
        return {
          error: 'NULL_DATA',
          message: 'Detail transaksi tidak ditemukan',
          statusCode: 200,
        };
      } else {
        return {
          error: '-',
          message: 'Detail transaksi ditemukan',
          statusCode: 200,
          detail_transaksi: results[0],
        };

      }

    }).catch((err) => {

      return {
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      };

    });

  if (detailInvoice.statusCode == 200 && detailInvoice.err != 'NULL_DATA') {

    return await knex('riwayat')
      .select()
      .where('transaksi_id', '=', request.params.id)
      .then((results) => {

        const response = h.response({
          error: '-',
          message: 'Detail transaksi ditemukan',
          statusCode: 200,
          detail_transaksi: detailInvoice.detail_transaksi,
          list_riwayat: results,
        });
        response.code(200);
        return response;

      })
      .catch((err) => {

        const response = h.response({
          error: err,
          message: 'Internal server error',
          statusCode: 500,
        });
        response.code(500);
        return response;

      });

  } else {

    const response = h.response(detailInvoice);
    response.code(detailInvoice.statusCode);
    return response;

  }

}

const updateInvoiceHandler = async (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  var updateInvoiceData = '';
  if (request.payload.nama_driver != '') {
    updateInvoiceData = {
      nama_driver: request.payload.nama_driver
    }
  } else if (request.payload.status != '') {
    updateInvoiceData = {
      status: request.payload.status
    }
  }

  const detailInvoice = await knex('transaksi')
    .where({ id: request.params.id })
    .update(updateInvoiceData)
    .then((results) => {

      return {
        error: '-',
        message: 'Data driver berhasil diubah',
        statusCode: 201,
      }

    })
    .catch((err) => {

      return {
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      };

    });

  if (detailInvoice.statusCode == 201) {

    if (request.payload.nama_driver) {

      const response = h.response(detailInvoice);
      response.code(detailInvoice.statusCode);
      return response;

    } else if (request.payload.status) {

      var detailRiwayat = '';
      if (request.payload.status == 'Belum Dibayar') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Menunggu pembayaran' };
      } else if (request.payload.status == 'Sudah Dibayar') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Pembayaran lunas' };
      } else if (request.payload.status == 'Obat Diracik') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat sedang diracik' };
      } else if (request.payload.status == 'Obat Siap') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat selesai diracik' };
      } else if (request.payload.status == 'Menunggu Diambil') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat menunggu diambil oleh driver' };
      } else if (request.payload.status == 'Obat Diantar') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat sedang diantar menuju alamat' };
      } else if (request.payload.status == 'Obat Diterima') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat telah diterima oleh pelanggan' };
      }

      return await knex('riwayat')
        .insert(detailRiwayat)
        .then((results) => {

          const response = h.response({
            error: '-',
            message: 'Data status dan riwayat berhasil diperbarui',
            statusCode: 201,
          });
          response.code(201);
          return response;

        }).catch((err) => {

          const response = h.response({
            error: err.code,
            message: 'Internal server error',
            statusCode: 500,
          });
          response.code(500);
          return response;

        });

    }

  } else {

    const response = h.response(detailInvoice);
    response.code(detailInvoice.statusCode);
    return response;

  }



}

const addPromoHandler = async (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  const checkKode = await knex('promo')
    .select()
    .where('kode_promo', '=', request.payload.kode_promo)
    .andWhere('is_expired', '=', '0')
    .then((results) => {

      if (!results || results.length == 0) {
        return true;
      } else {
        return false;
      }
    })

  if (!checkKode) {
    const response = h.response({
      error: 'Duplicate Entry',
      message: 'Kode promo masih berlaku',
      statusCode: 200,
    });
    response.code(200);
    return response;
  }

  return await knex('promo')
    .insert(request.payload)
    .then((results) => {

      const response = h.response({
        error: '-',
        message: 'Data promo berhasil ditambahkan',
        statusCode: 201,
      });
      response.code(201);
      return response;


    }).catch((err) => {

      const response = h.response({
        error: err.code,
        message: err.message,
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getListPromoHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('promo')
    .select()
    .where('kode_promo', 'like', '%' + request.query.kode_promo + '%')
    .andWhere({ is_expired: request.query.is_expired })
    .orderBy('updated_at', 'desc')
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Daftar promo tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Daftar promo ditemukan',
          statusCode: 200,
          list_promo: results,
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getDetailPromoHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('promo')
    .where({ id: request.params.id })
    .select()
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Detail promo tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Detail promo ditemukan',
          statusCode: 200,
          detail_promo: results[0],
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const updatePromoHandler = (request, h) => {

  return knex('promo')
    .where({ id: request.params.id })
    .update(request.payload)
    .then((results) => {

      const response = h.response({
        error: '-',
        message: 'Data promo berhasil diubah',
        statusCode: 201,
      });
      response.code(201);
      return response;

    })
    .catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getCostHandler = (request, h) => {
  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('harga')
    .where('min_jarak', '<=', request.query.jarak)
    .andWhere('max_jarak', '>=', request.query.jarak)
    .andWhere('metode_antar', '=', request.query.metode_antar)
    .select()
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Detail harga tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Detail harga ditemukan',
          statusCode: 200,
          detail_harga: results[0],
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getTrackHandler = async (request, h) => {
  const detailInvoice = await knex('rs')
    .select('transaksi.*', 'rs.nama_rs', 'rs.alamat_rs')
    .rightJoin('transaksi', 'rs.id', 'transaksi.rs_id')
    .where('transaksi.no_resi', '=', request.params.resi)

    .then((results) => {

      if (!results || results.length == 0) {
        return {
          error: 'NULL_DATA',
          message: 'Detail transaksi tidak ditemukan',
          statusCode: 200,
        };
      } else {
        return {
          error: '-',
          message: 'Detail transaksi ditemukan',
          statusCode: 200,
          detail_transaksi: results[0],
        };

      }

    }).catch((err) => {

      return {
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      };

    });

  if (detailInvoice.statusCode == 200 && detailInvoice.err != 'NULL_DATA') {

    return await knex('riwayat')
      .select('id', 'detail_riwayat', knex.raw('DATE_FORMAT(`created_at`, "%Y-%m-%d %H:%i:%s") as ??', ['created_at']))
      .where('transaksi_id', '=', detailInvoice.detail_transaksi.id)
      .orderBy('id', 'desc')
      .then((results) => {

        const response = h.response({
          error: '-',
          message: 'Detail transaksi ditemukan',
          statusCode: 200,
          detail_transaksi: detailInvoice.detail_transaksi,
          list_riwayat: results,
        });
        response.code(200);
        return response;

      })
      .catch((err) => {

        const response = h.response({
          error: err,
          message: 'Internal server error',
          statusCode: 500,
        });
        response.code(500);
        return response;

      });

  } else {

    const response = h.response(detailInvoice);
    response.code(detailInvoice.statusCode);
    return response;

  }

}

const getCheckPromoHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  return knex('promo')
    .where('kode_promo', '=', request.params.kode_promo)
    .andWhere('max_jarak', '>=', request.query.jarak)
    .select()
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Detail promo tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Detail promo ditemukan',
          statusCode: 200,
          detail_promo: results[0],
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });

}

const getGraphInvoiceHandler = (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }



  return knex
    .select(
      'transaksi.total_omzet',
      'transaksi.total_untung',
      knex.raw('COALESCE(`same_day`.`total_sameday`, 0 ) as ??', ['total_sameday']),
      knex.raw('COALESCE(`express`.`total_express`, 0 ) as ??', ['total_express']),
      'transaksi.tanggal'
    )
    .fromRaw('(SELECT COUNT(`metode_antar`) as total_express, DATE_FORMAT(`created_at`, "%Y-%m-%d") as tanggal from transaksi WHERE metode_antar = "Express" GROUP BY tanggal) as ??', ['express'])
    .rightJoin(
      knex('transaksi')
        .select(
          knex.raw('(SUM(`transaksi`.`harga_awal`))-(SUM(`transaksi`.`harga_potongan`)) as ??', ['total_omzet']),
          knex.raw('SUM(`transaksi`.`harga_untung`) as ??', ['total_untung']),
          knex.raw('DATE_FORMAT(`created_at`, "%Y-%m-%d") as ??', ['tanggal'])
        )
        .groupBy('tanggal').as('transaksi'),
      'express.tanggal',
      'transaksi.tanggal'
    )
    .leftJoin(
      knex('transaksi')
        .select(
          knex.raw('COUNT(`metode_antar`) as ??', ['total_sameday']),
          knex.raw('DATE_FORMAT(`created_at`, "%Y-%m-%d") as ??', ['tanggal'])
        )
        .groupBy('tanggal').as('same_day'),
      'same_day.tanggal',
      'transaksi.tanggal'
    )
    .groupBy('transaksi.tanggal')
    .orderBy('transaksi.tanggal', 'asc')
    .where('transaksi.tanggal', '>=', request.query.start)
    .andWhere('transaksi.tanggal', '<=', request.query.end)
    .limit(30)
    .then((results) => {

      if (!results || results.length == 0) {

        const response = h.response({
          error: 'NULL_DATA',
          message: 'Daftar transaksi tidak ditemukan',
          statusCode: 200,
        });
        response.code(200);
        return response;

      } else {

        const response = h.response({
          error: '-',
          message: 'Daftar transaksi ditemukan',
          statusCode: 200,
          list_grafik: results,
        });
        response.code(200);
        return response;

      }

    }).catch((err) => {

      const response = h.response({
        error: err,
        message: 'Internal server error',
        statusCode: 500,
      });
      response.code(500);
      return response;

    });
}

const getExportInvoiceHandler = async (request, h) => {

  const authHeader = request.headers.authorization.split(' ')[1];
  if (authHeader) {
    authData = getAuth(authHeader);
  }
  if (authData.message == 'invalid token' || authData.message == 'jwt expired' || authData.message == 'jwt malformed' || authData.message == 'Unexpected token  in JSON at position 0') {
    const response = h.response({
      error: 'FORBIDDEN',
      message: authData.message,
      statusCode: 403,
    });
    response.code(403);
    return response;
  }

  var query = knex('transaksi').
    select(
      'transaksi.id',
      knex.raw('DATE_FORMAT(`transaksi`.`created_at`, "%Y-%m-%d %H:%i:%s") as ??', ['created_at']),
      'transaksi.no_resi',
      'transaksi.no_antrian',
      'transaksi.nama_pasien',
      'transaksi.alamat_pasien',
      'transaksi.telp_pasien',
      'transaksi.nama_driver',
      'transaksi.harga_awal',
      'transaksi.harga_potongan',
      knex.raw('(`transaksi`.`harga_awal`)-(`transaksi`.`harga_potongan`) as ??', ['total_omzet']),
      'transaksi.harga_driver',
      'transaksi.harga_untung',
      knex.raw('DATE_FORMAT(`obat_siap`.`created_at`, "%Y-%m-%d %H:%i:%s") as ??', ['obat_siap']),
      knex.raw('DATE_FORMAT(`obat_diantar`.`created_at`, "%Y-%m-%d %H:%i:%s") as ??', ['obat_diantar']),
      knex.raw('DATE_FORMAT(`obat_diterima`.`created_at`, "%Y-%m-%d %H:%i:%s") as ??', ['obat_diterima']),
    )
    .leftJoin(
      knex('riwayat')
        .select(
          'transaksi_id',
          'created_at'
        )
        .where(
          'detail_riwayat', '=', 'Obat selesai diracik'
        )
        .as('obat_siap'),
      'transaksi.id',
      'obat_siap.transaksi_id'
    )
    .leftJoin(
      knex('riwayat')
        .select(
          'transaksi_id',
          'created_at'
        )
        .where(
          'detail_riwayat', '=', 'Obat sedang diantar menuju alamat'
        )
        .as('obat_diantar'),
      'transaksi.id',
      'obat_diantar.transaksi_id'
    )
    .leftJoin(
      knex('riwayat')
        .select(
          'transaksi_id',
          'created_at'
        )
        .where(
          'detail_riwayat', '=', 'Obat telah diterima oleh pelanggan'
        )
        .as('obat_diterima'),
      'transaksi.id',
      'obat_diterima.transaksi_id'
    )
    .where(
      'transaksi.status', '=', 'Obat Diterima'
    );

    if(request.query.action == "range"){
      console.log(request.query);
      query = query.andWhere('transaksi.created_at', '>=', request.query.start)
      .andWhere('transaksi.created_at', '<=', request.query.end);
    }
    query = await query.orderBy(
      'transaksi.created_at', 'asc'
    )
    .then((results) => {

      if (!results || results.length == 0) {

        return null;

      } else {

        return results;

      }

    }).catch((err) => {
      console.log(err)
      return 'Internal server error';
    });

  if (query == null || query.length == 0) {
    const response = h.response({
      error: 'NULL_DATA',
      message: 'Daftar transaksi tidak ditemukan',
      statusCode: 200,
    });
    response.code(200);
    return response;
  }
  else if (query == 'Internal server error') { 
    const response = h.response({
      error: query,
      message: 'Internal server error',
      statusCode: 500,
    });
    response.code(500);
    return response;
  }
  else {
    console.log(query.length)
    const response = h.response({
      error: '-',
      message: 'Daftar transaksi ditemukan',
      statusCode: 200,
      list_transaksi: query,
    });
    response.code(200);
    return response;
  }

}

function convertHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours   = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
}

module.exports = {
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
  getGraphInvoiceHandler,
  getExportInvoiceHandler,
};