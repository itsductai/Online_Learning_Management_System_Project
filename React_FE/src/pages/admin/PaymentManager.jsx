import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  ChevronUp,
  ChevronDown,
  DollarSign,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  RefreshCw,
} from "lucide-react"
import Sidebar from "../../components/admin/Sidebar"
import { getAllPayments } from "../../services/paymentAPI"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const PaymentManager = () => {
  // Khai báo state và hooks
  const navigate = useNavigate()
  const [payments, setPayments] = useState([]) // State lưu trữ danh sách thanh toán
  const [loading, setLoading] = useState(true) // State hiển thị trạng thái đang tải
  const [error, setError] = useState("") // State lưu trữ thông báo lỗi
  const [isSidebarOpen, setIsSidebarOpen] = useState(true) // State điều khiển trạng thái sidebar

  // State cho bộ lọc và tìm kiếm
  const [searchTerm, setSearchTerm] = useState("") // State lưu từ khóa tìm kiếm
  const [statusFilter, setStatusFilter] = useState("all") // State lọc theo trạng thái (all, success, fail, waiting)
  const [methodFilter, setMethodFilter] = useState("all") // State lọc theo phương thức thanh toán (all, momo, vnpay)
  const [sortField, setSortField] = useState("createdAt") // State trường sắp xếp
  const [sortDirection, setSortDirection] = useState("desc") // State hướng sắp xếp (asc, desc)
  const [minAmount, setMinAmount] = useState("") // State lọc theo số tiền tối thiểu
  const [maxAmount, setMaxAmount] = useState("") // State lọc theo số tiền tối đa
  const [startDate, setStartDate] = useState("") // State lọc theo ngày bắt đầu
  const [endDate, setEndDate] = useState("") // State lọc theo ngày kết thúc

  // State cho thống kê
  const [stats, setStats] = useState({
    totalPayments: 0, // Tổng số thanh toán
    totalAmount: 0, // Tổng số tiền
    successCount: 0, // Số thanh toán thành công
    failCount: 0, // Số thanh toán thất bại
    waitingCount: 0, // Số thanh toán đang chờ
    momoCount: 0, // Số thanh toán qua MoMo
    vnpayCount: 0, // Số thanh toán qua VNPay
  })

  // Hàm lấy dữ liệu thanh toán từ API
  const fetchPayments = async () => {
    try {
      setLoading(true) // Bắt đầu hiển thị trạng thái loading
      const data = await getAllPayments() // Gọi API lấy tất cả thanh toán
      setPayments(data) // Cập nhật state với dữ liệu từ API

      // Tính toán thống kê
      const totalAmount = data.reduce((sum, payment) => sum + payment.amount, 0)
      const successCount = data.filter((payment) => payment.status === "success").length
      const failCount = data.filter((payment) => payment.status === "fail").length
      const waitingCount = data.filter((payment) => payment.status === "waiting").length
      const momoCount = data.filter((payment) => payment.method === "momo").length
      const vnpayCount = data.filter((payment) => payment.method === "vnpay").length

      // Cập nhật state thống kê
      setStats({
        totalPayments: data.length,
        totalAmount,
        successCount,
        failCount,
        waitingCount,
        momoCount,
        vnpayCount,
      })
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu thanh toán:", err)
      setError("Không thể tải dữ liệu thanh toán. Vui lòng thử lại sau.") // Cập nhật thông báo lỗi
    } finally {
      setLoading(false) // Kết thúc trạng thái loading
    }
  }

  // Gọi API khi component được mount
  useEffect(() => {
    fetchPayments()
  }, [])

  // Hàm chuyển đổi trạng thái thanh toán sang tiếng Việt và màu sắc tương ứng
  const getStatusInfo = (status) => {
    switch (status) {
      case "success":
        return { text: "Thành công", color: "bg-green-100 text-green-800" }
      case "fail":
        return { text: "Thất bại", color: "bg-red-100 text-red-800" }
      case "waiting":
        return { text: "Đang chờ", color: "bg-yellow-100 text-yellow-800" }
      default:
        return { text: "Không xác định", color: "bg-gray-100 text-gray-800" }
    }
  }

  // Hàm chuyển đổi phương thức thanh toán sang tiếng Việt
  const getMethodText = (method) => {
    switch (method) {
      case "momo":
        return "MoMo"
      case "vnpay":
        return "VNPay"
      default:
        return method
    }
  }

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  // Hàm định dạng số tiền
  const formatCurrency = (amount) => {
    return amount?.toLocaleString("vi-VN") + "đ"
  }

  // Hàm đổi hướng sắp xếp
  const toggleSort = (field) => {
    if (sortField === field) {
      // Nếu đang sắp xếp theo field này, đổi hướng sắp xếp
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      // Nếu chuyển sang field mới, mặc định sắp xếp giảm dần
      setSortField(field)
      setSortDirection("desc")
    }
  }

  // Hàm reset tất cả bộ lọc
  const resetFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
    setMethodFilter("all")
    setMinAmount("")
    setMaxAmount("")
    setStartDate("")
    setEndDate("")
  }

  // Hàm xuất dữ liệu ra file CSV
  const exportToCSV = () => {
    // Tạo header cho file CSV
    const headers = [
      "ID",
      "Người dùng",
      "Khóa học",
      "Mã giảm giá",
      "Phương thức",
      "Số tiền",
      "Trạng thái",
      "Ngày tạo",
    ].join(",")

    // Tạo nội dung cho file CSV từ dữ liệu đã lọc
    const csvContent = filteredPayments
      .map((payment) => {
        return [
          payment.paymentId,
          `"${payment.userName}"`, // Thêm dấu ngoặc kép để tránh lỗi khi tên có dấu phẩy
          `"${payment.courseTitle}"`,
          payment.couponCode || "",
          payment.method,
          payment.amount,
          payment.status,
          formatDateTime(payment.createdAt),
        ].join(",")
      })
      .join("\n")

    // Tạo nội dung đầy đủ của file CSV
    const csv = `${headers}\n${csvContent}`

    // Tạo blob và link tải xuống
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `thanh-toan-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Lọc và sắp xếp dữ liệu thanh toán
  const filteredPayments = useMemo(() => {
    return payments
      .filter((payment) => {
        // Lọc theo từ khóa tìm kiếm
        const matchesSearch =
          payment.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.couponCode && payment.couponCode.toLowerCase().includes(searchTerm.toLowerCase()))

        // Lọc theo trạng thái
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter

        // Lọc theo phương thức thanh toán
        const matchesMethod = methodFilter === "all" || payment.method === methodFilter

        // Lọc theo khoảng số tiền
        const matchesMinAmount = !minAmount || payment.amount >= Number.parseInt(minAmount)
        const matchesMaxAmount = !maxAmount || payment.amount <= Number.parseInt(maxAmount)

        // Lọc theo khoảng thời gian
        const paymentDate = new Date(payment.createdAt)
        const matchesStartDate = !startDate || paymentDate >= new Date(startDate)
        const matchesEndDate = !endDate || paymentDate <= new Date(endDate + "T23:59:59")

        // Trả về true nếu thanh toán thỏa mãn tất cả điều kiện lọc
        return (
          matchesSearch &&
          matchesStatus &&
          matchesMethod &&
          matchesMinAmount &&
          matchesMaxAmount &&
          matchesStartDate &&
          matchesEndDate
        )
      })
      .sort((a, b) => {
        // Sắp xếp theo trường đã chọn
        let comparison = 0

        switch (sortField) {
          case "paymentId":
            comparison = a.paymentId - b.paymentId
            break
          case "userName":
            comparison = a.userName.localeCompare(b.userName)
            break
          case "courseTitle":
            comparison = a.courseTitle.localeCompare(b.courseTitle)
            break
          case "amount":
            comparison = a.amount - b.amount
            break
          case "createdAt":
            comparison = new Date(a.createdAt) - new Date(b.createdAt)
            break
          default:
            comparison = 0
        }

        // Đảo ngược kết quả nếu sắp xếp giảm dần
        return sortDirection === "asc" ? comparison : -comparison
      })
  }, [
    payments,
    searchTerm,
    statusFilter,
    methodFilter,
    minAmount,
    maxAmount,
    startDate,
    endDate,
    sortField,
    sortDirection,
  ])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar component */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý thanh toán</h1>
            <div className="flex gap-2">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất CSV
              </button>
              <button
                onClick={fetchPayments}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
            </div>
          </div>

          {/* Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng thanh toán</p>
                  <p className="text-2xl font-bold">{stats.totalPayments}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-2 flex justify-between text-sm">
                <span className="text-green-600">Thành công: {stats.successCount}</span>
                <span className="text-red-600">Thất bại: {stats.failCount}</span>
                <span className="text-yellow-600">Đang chờ: {stats.waitingCount}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Tổng doanh thu</p>
                  <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">Từ {stats.successCount} giao dịch thành công</div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Thanh toán MoMo</p>
                  <p className="text-2xl font-bold">{stats.momoCount}</p>
                </div>
                <div className="p-3 bg-pink-100 rounded-full">
                  <div className="w-6 h-6 flex items-center justify-center text-pink-600 font-bold">M</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {((stats.momoCount / stats.totalPayments) * 100 || 0).toFixed(1)}% tổng thanh toán
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Thanh toán VNPay</p>
                  <p className="text-2xl font-bold">{stats.vnpayCount}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <div className="w-6 h-6 flex items-center justify-center text-blue-600 font-bold">V</div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                {((stats.vnpayCount / stats.totalPayments) * 100 || 0).toFixed(1)}% tổng thanh toán
              </div>
            </div>
          </div>

          {/* Bộ lọc */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Tìm kiếm */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên người dùng, khóa học, mã giảm giá..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              {/* Lọc theo trạng thái */}
              <div className="flex gap-2">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-2 rounded-lg ${
                    statusFilter === "all" ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Tất cả
                </button>
                <button
                  onClick={() => setStatusFilter("success")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    statusFilter === "success"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Thành công
                </button>
                <button
                  onClick={() => setStatusFilter("fail")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    statusFilter === "fail" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Thất bại
                </button>
                <button
                  onClick={() => setStatusFilter("waiting")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    statusFilter === "waiting"
                      ? "bg-yellow-600 text-white"
                      : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                  }`}
                >
                  <Clock className="w-4 h-4 mr-1" />
                  Đang chờ
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Lọc theo phương thức thanh toán */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phương thức thanh toán</label>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">Tất cả</option>
                  <option value="momo">MoMo</option>
                  <option value="vnpay">VNPay</option>
                </select>
              </div>

              {/* Lọc theo khoảng số tiền */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng số tiền</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Từ"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                  <input
                    type="number"
                    placeholder="Đến"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>
              </div>

              {/* Lọc theo khoảng thời gian */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải dữ liệu thanh toán...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredPayments.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Không tìm thấy thanh toán nào phù hợp với bộ lọc.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("paymentId")}
                      >
                        <div className="flex items-center">
                          ID
                          {sortField === "paymentId" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("userName")}
                      >
                        <div className="flex items-center">
                          Người dùng
                          {sortField === "userName" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("courseTitle")}
                      >
                        <div className="flex items-center">
                          Khóa học
                          {sortField === "courseTitle" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã giảm giá
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phương thức
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("amount")}
                      >
                        <div className="flex items-center">
                          Số tiền
                          {sortField === "amount" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("createdAt")}
                      >
                        <div className="flex items-center">
                          Ngày tạo
                          {sortField === "createdAt" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                      const statusInfo = getStatusInfo(payment.status)

                      return (
                        <tr key={payment.paymentId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paymentId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.userName}</td>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{payment.courseTitle}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {payment.couponCode || "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {getMethodText(payment.method)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                            >
                              {statusInfo.text}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(payment.createdAt)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Phân trang */}
          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Hiển thị {filteredPayments.length} / {payments.length} thanh toán
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentManager

