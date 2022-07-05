const OrderDetailModel = require("../models/OrderDetailModel")
const OrderModel = require("../models/OrderModel")
const ResponseUtil = require("../utils/ResponseUtil")

class OrderController {
    /**
     * Method: GET
     * /order/get-orders
     */

    getOrder = async(req, res) => {
        const page = req.query.page
        try {
            const objCondition = {
                joinUser: true,
                joinPaymentMethod: true,
                page,
            }

            const orders =await OrderModel.get(objCondition)

            if(!orders) {
                throw new Error('Lỗi hệ thống')
            }

            return res.json(orders)

        } catch (error) {   
            return res.json(ResponseUtil.response(false, error.message))
        }
    }

    getOrderDetail = async (req, res) => {
        const data =req.query
        try {
            const condition = {
                ...data,
                joinOrder: true,
                joinProduct: true,
            }
            const response = await OrderDetailModel.get(condition) 

            if(!response) {
                throw new Error('Không thể kết nối')
            }
            return res.json(response)
        } catch (error) {
            return res.json(ResponseUtil.response(false, error.message))
        }
    }
    /**
     * Method: POST
     * /order/checkout-v1
     */

    checkoutV1 = async(req, res) => {
        const data = req.body
        try {
            const response = await OrderModel.checkoutV1(data)

            if(!response) {
                throw new Error('Lỗi hệ thống')
            }

            return res.json(response)
        } catch (error) {
            return res.json(ResponseUtil.response(false, error.message))
        }
    }

    /**
     * Checkout trực tiếp không qua giỏ hàng, không cần đăng nhập
     * Method POST
     * /order/checkout-v2 
     */
    checkoutV2 = async (req, res) => {
        const data = req.body
        if(!data) {
            return ResponseUtil.response(false, 'Tham số không hợp lệ')
        }
        try {
            const checkoutResponse = await OrderModel.checkoutV2(data)

            if(!checkoutResponse) {
                throw new Error('Không thể sử lý')
            }
            return res.json(checkoutResponse)
        } catch (error) {
            return res.json(ResponseUtil.response(false, error.message))
        }
    }

    /**
     * Checkout qua giỏ hàng khi chưa đăng nhập
     * Method: POST
     * url: order/checkout-v3
     * params: 
     * + Thông tin => Email, SoDienThoai, TinhThanh, QuanHuyen, PhuongXa, SoNha
     * + IDGioHang
     * + IDSanPham : có thể truyền 1 hoặc nhiều vd 1,2,3
     * + IDPhuongThucThanhToan: cái này tự thêm database trước, id = 1 là thanh toán khi nhận hàng, id=2 là thanh toán qua momo.
     */

    checkoutV3 = async (req, res) => {
        const data = req.body
        // const emailUser = req.emailUser
        // if(!emailUser) {
        //     return res.json(ResponseUtil.response(false, 'Vui lòng đăng nhập để sử dụng'))
        // }

        if(!data) {
            return res.json(ResponseUtil.response(false, 'Tham số không hợp lệ'))
        }

        try {
            const response = await OrderModel.checkoutV3(data)
            if(!response) {
                throw new Error('Lỗi xử lý')
            }
            return res.json(response)
        } catch (error) {
            return res.json(false, error.message)
        }
    }
}

module.exports = new OrderController()