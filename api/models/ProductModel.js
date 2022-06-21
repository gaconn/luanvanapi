const dbconnect = require("./DBConnection")
const ResponseUtil = require("../utils/ResponseUtil")
const GeneralUtil = require("../utils/GeneralUtil")
const { object_filter, buildFieldQuery } = require("../utils/DBUtil")
class ProductModel {
    constructor() {
        this.table = "sanpham"
    }
    get = async(objCondition) => {
        if(!objCondition || !objCondition.page) {
            objCondition = {...objCondition, page: 1}
        }
        if(objCondition.page< 1) {
            return ResponseUtil.response(false, "Trang không hợp lệ")
        }
        var start= (objCondition.page-1)*10
        try {
            const strWhere = this._buildWhereQuery(objCondition)
            var strJoin = ""
            if(objCondition.joinCategory) {
                strJoin += `left join (select tl1.id TheLoai_ID, tl1.Ten TheLoai_Ten, tl1.HoatDong TheLoai_HoatDong, tl1.IDTheLoaiCha TheLoai_IDTheLoaiCha from ${this.table} sp1 join theloai tl1 on \
                    sp1.IDTheLoai = tl1.id where tl1.DaXoa = 0) as tl1 on ${this.table}.IDTheLoai = tl1.TheLoai_ID `
            }

            if(objCondition.joinSupplier) {
                strJoin += `left join (select ncc1.id NhaCungCap_ID, ncc1.Ten NhaCungCap_Ten, ncc1.TrangThai NhaCungCap_TrangThai from ${this.table} sp2 left join nhacungcap ncc1 on sp2.IDNhaCungCap = ncc1.id \
                where ncc1.DaXoa = 0) as ncc1 on ${this.table}.IDNhaCungCap = ncc1.NhaCungCap_ID `
            }
            const query = `select * from ${this.table} ${strJoin} ${strWhere} limit 10 offset ${start}`
            const arrData = await dbconnect.query(query)

            if(!arrData ) {
                return ResponseUtil.response(false, 'Không thể truy xuất dữ liệu từ database', [], ['Truy xuất dữ liệu thất bại'])
            }
            if(!arrData[0]) {
                return ResponseUtil.response(true, 'Không có dữ liệu', [], ['Không tìm thấy dữ liệu'])
            }

            const queryCount = `select COUNT(sanpham.id) as rowCount from sanpham ${strWhere}`
            const arrCount = await dbconnect.query(queryCount)

            if( !arrCount) {
                return ResponseUtil.response(false, 'Không thể truy xuất dữ liệu từ database', [], ['Truy xuất dữ liệu thất bại'])
            }
            if(!arrCount[0]) {
                return ResponseUtil.response(true, 'Không có dữ liệu', [], ['Không tìm thấy dữ liệu'])
            }

            return ResponseUtil.response(true, 'Thành công', {data:arrData[0], rowCount: arrCount[0][0].rowCount})
        } catch (error) {
            return ResponseUtil.response(false, 'Lỗi hệ thống', [], [error.message])
        }
    }

    insert = async (objProduct) => {
        var error = []
        if(objProduct.Ten === "") {
            error.push('Tên nhà cung cấp không được để trống')
        }

        if(!objProduct.SoLuong) {
            error.push('Số lượng không đươc để trống')
        }
        if(!objProduct.GiaGoc) {
            error.push('Giá gốc không được để trống')
        }

        if(!objProduct.IDTheLoai) {
            error.push('Thể loại không được để trống')
        }

        if(!objProduct.IDNhaCungCap) {
            error.push('Nhà cung cấp không được để trống')
        }
        if(error.length > 0) {
            return ResponseUtil.response(false, 'Dữ liệu không hợp lệ', [], error)
        }

        try {

            const categoryExist = await dbconnect.query("select * from theloai where id =? limit 1", [objProduct.IDTheLoai])
            const supplierExist = await dbconnect.query("select * from nhacungcap where id =? limit 1", [objProduct.IDNhaCungCap])

            if(!categoryExist || !categoryExist[0] || categoryExist[0].length === 0) {
                return ResponseUtil.response(false, 'Ngành hàng không tồn tại')
            }

            if(!supplierExist || !supplierExist[0] || supplierExist[0].length === 0) {
                return ResponseUtil.response(false, 'Nhà cung cấp không tồn tại')
            }
            var objField = {
                Ten: objProduct.Ten,
                TrangThai: 1,
                DaXoa: 0,
                XuatXu: objProduct.XuatXu ? objProduct.XuatXu : "",
                MauSac: objProduct.MauSac ? objProduct.MauSac : undefined,
                KichThuoc: objProduct.KichThuoc ? objProduct.KichThuoc : undefined,
                CanNang: objProduct.CanNang ? objProduct.CanNang : undefined,
                SoLuong: objProduct.SoLuong ? objProduct.SoLuong : 0,
                MoTa: objProduct.MoTa ? objProduct.MoTa : "",
                GiaGoc: objProduct.GiaGoc,
                IDTheLoai: objProduct.IDTheLoai,
                IDNhaCungCap: objProduct.IDNhaCungCap,
                ThoiGianTao: new Date().getTime()/1000,
            }
            objField = object_filter(objField)
            const strField = buildFieldQuery(objField)
            if(strField === "" || !strField ) {
                throw new Error('build query thất bại')
            } 

            const arrField = strField.split(', ')

            var arrValue = []

            for(let i = 0; i<arrField.length ; i++) {
                arrValue.push(objField[arrField[i].trim()])
            }
            const query = `insert into sanpham(${strField}) values(?)`
            const dataResponse = await dbconnect.query(query, [arrValue])

            if(!dataResponse || !dataResponse[0]) {
                return ResponseUtil.response(false, 'Không thể truy xuất database', [] , ['Không thể truy xuất database'])
            }
            if(dataResponse[0].affectedRows === 0) {
                return ResponseUtil.response(false, 'Thất bại', [], 'Dữ liệu không hợp lệ')
            }
            return ResponseUtil.response(true, 'Thành công' )
        } catch (error) {
            return ResponseUtil.response(false, 'Lỗi hệ thống', [], [error])
        }
    }
    _buildWhereQuery = (objCondition) => {
        var strWhere = "where 1=1 "
        if(GeneralUtil.checkIsEmptyObject(objCondition)) {
            return strWhere
        }
        
        if(objCondition.hasOwnProperty('id') && objCondition.id) {
            strWhere += `and id = ${objCondition.id}`
        }

        if(objCondition.hasOwnProperty('Ten') && objCondition.Ten) {
            strWhere += `and Ten = ${objCondition.Ten}`
        }

        if(objCondition.hasOwnProperty('DaXoa') && objCondition.DaXoa) {
            strWhere += ` and DaXoa = ${objCondition.DaXoa}`
        }

        if(objCondition.hasOwnProperty('TrangThai') && objCondition.TrangThai) {
            strWhere += ` and TrangThai = ${objCondition.TrangThai}`
        }
        if(objCondition.hasOwnProperty('ThoiGianTao')) {
            strWhere += `and ThoiGianTao > ${objCondition.ThoiGianTao}`
        }

        return strWhere
    }
}

module.exports = new ProductModel()