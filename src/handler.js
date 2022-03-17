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

const addHospitalHandler = (request, h) => {

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

  const newRecord = request.payload;

  newRecord.pin = pin;

  return knex('rs')
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
    .select('rs.id', 'rs.kode_rs', 'rs.is_cs', 'rs.nama_rs',knex.raw('COALESCE(`transaksi`.`num_progress`, 0 ) as ??', ['num_progress']))
    .leftJoin(
      knex('transaksi')
      .select('rs_id', knex.raw('count(*) as ??', ['num_progress']))
      .groupBy('rs_id').as('transaksi'),
      'transaksi.rs_id',
      'rs.id'
    )
    .where('rs.is_cs','=',request.query.cs)
    .andWhere('rs.nama_rs','like','%'+request.query.nama_rs+'%')
    
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
    .select('id', 'kode_rs', 'is_cs', 'nama_rs', 'alamat_rs', 'long_rs', 'lat_rs', 'font_size')
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

  const addInvoice = await knex('transaksi')
    .insert(request.payload)
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
    .select('transaksi.id', 'transaksi.rs_id', 'transaksi.updated_at', 'transaksi.nama_pasien', 'transaksi.no_resi', 'transaksi.status', 'rs.is_cs')
    .rightJoin('transaksi', 'rs.id', 'transaksi.rs_id')
    .where('rs_id', '=', request.query.rs_id)
    .andWhere('status', 'like', '%' + status + '%')
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
        error: err,
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

  const detailInvoice = await knex('transaksi')
    .where({ id: request.params.id })
    .update(request.payload)
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
      }else if (request.payload.status == 'Obat Diracik') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat sedang diracik' };
      }else if (request.payload.status == 'Obat Siap') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat selesai diracik' };
      }else if (request.payload.status == 'Menunggu Diambil') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat menunggu diambil oleh driver' };
      }else if (request.payload.status == 'Obat Diantar') {
        detailRiwayat = { transaksi_id: request.params.id, detail_riwayat: 'Obat sedang diantar menuju alamat' };
      }else if (request.payload.status == 'Obat Diterima') {
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

const addPromoHandler = (request, h) => {

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
    .where('kode_promo','like','%'+request.query.kode_promo+'%')
    .andWhere({is_expired:request.query.is_expired})
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
      .select()
      .where('transaksi_id', '=', detailInvoice.detail_transaksi.id)
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
};