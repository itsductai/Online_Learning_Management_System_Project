import { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  Edit,
  ChevronUp,
  ChevronDown,
  Calendar,
  Tag,
  Check,
  X,
  AlertTriangle,
  RefreshCw,
} from "lucide-react"
import Sidebar from "../../components/admin/Sidebar"
import { format, isAfter } from "date-fns"
import { vi } from "date-fns/locale"
import {
  getAllCoupons as apiGetAllCoupons,
  getCouponById,
  createCoupon as apiCreateCoupon,
  updateCoupon as apiUpdateCoupon,
  toggleCouponStatus as apiToggleCouponStatus,
  validateCoupon
} from "../../services/couponAPI"

const CouponManager = () => {
  const navigate = useNavigate()
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [discountTypeFilter, setDiscountTypeFilter] = useState("all")
  const [sortField, setSortField] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("desc")

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    code: "",
    expiryDate: "",
    maxUsageCount: 1,
    discountType: "percent",
    discountValue: "",
    isActive: true,
  })

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState("")

  const fetchCoupons = async () => {
    try {
      setLoading(true)
      const data = await apiGetAllCoupons()
      setCoupons(data)
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu mã giảm giá:", err)
      setError("Không thể tải dữ liệu mã giảm giá. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoupons()
  }, [])

  const formatDateTime = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi })
    } catch (error) {
      return dateString
    }
  }

  const formatCurrency = (amount) => {
    return amount?.toLocaleString("vi-VN") + "đ"
  }

  const isExpired = (expiryDate) => {
    return !isAfter(new Date(expiryDate), new Date())
  }

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const resetForm = () => {
    setFormData({
      code: "",
      expiryDate: "",
      maxUsageCount: 1,
      discountType: "percent",
      discountValue: "",
      isActive: true,
    })
  }

  const openAddModal = () => {
    setIsEditing(false)
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (coupon) => {
    setIsEditing(true)
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      expiryDate: coupon.expiryDate.split("T")[0],
      maxUsageCount: coupon.maxUsageCount,
      discountType: coupon.discountPercent !== null ? "percent" : "amount",
      discountValue: coupon.discountPercent !== null ? coupon.discountPercent : coupon.discountAmount,
      isActive: coupon.isActive,
    })
    setIsModalOpen(true)
  }

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      const couponData = {
        code: formData.code,
        expiryDate: new Date(formData.expiryDate).toISOString(),
        maxUsageCount: Number.parseInt(formData.maxUsageCount),
        discountPercent: formData.discountType === "percent" ? Number.parseInt(formData.discountValue) : null,
        discountAmount: formData.discountType === "amount" ? Number.parseInt(formData.discountValue) : null,
        isActive: formData.isActive,
      }

      if (isEditing) {
        await apiUpdateCoupon(selectedCoupon.couponId, couponData)
      } else {
        await apiCreateCoupon(couponData)
      }

      setIsModalOpen(false)
      fetchCoupons()
    } catch (error) {
      console.error("Lỗi khi lưu mã giảm giá:", error)
      alert("Có lỗi xảy ra khi lưu mã giảm giá. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const openToggleStatusConfirm = (coupon) => {
    setSelectedCoupon(coupon)
    setConfirmMessage(
      coupon.isActive
        ? `Bạn có chắc chắn muốn vô hiệu hóa mã giảm giá "${coupon.code}"?`
        : `Bạn có chắc chắn muốn kích hoạt lại mã giảm giá "${coupon.code}"?`
    )
    setConfirmAction(() => () => handleToggleStatus(coupon.couponId, !coupon.isActive))
    setIsConfirmModalOpen(true)
  }

  const handleToggleStatus = async (couponId, isActive) => {
    try {
      await apiToggleCouponStatus(couponId, isActive)
      setIsConfirmModalOpen(false)
      fetchCoupons()
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái mã giảm giá:", error)
      alert("Có lỗi xảy ra khi thay đổi trạng thái mã giảm giá. Vui lòng thử lại.")
    }
  }

  // Lọc và sắp xếp dữ liệu mã giảm giá
  const filteredCoupons = useMemo(() => {
    return coupons
      .filter((coupon) => {
        // Lọc theo từ khóa tìm kiếm
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase())

        // Lọc theo trạng thái
        const matchesStatus =
          statusFilter === "all" ||
          (statusFilter === "active" && coupon.isActive) ||
          (statusFilter === "inactive" && !coupon.isActive)

        // Lọc theo loại giảm giá
        const matchesDiscountType =
          discountTypeFilter === "all" ||
          (discountTypeFilter === "percent" && coupon.discountPercent !== null) ||
          (discountTypeFilter === "amount" && coupon.discountAmount !== null)

        // Trả về true nếu mã giảm giá thỏa mãn tất cả điều kiện lọc
        return matchesSearch && matchesStatus && matchesDiscountType
      })
      .sort((a, b) => {
        // Sắp xếp theo trường đã chọn
        let comparison = 0

        switch (sortField) {
          case "couponId":
            comparison = a.couponId - b.couponId
            break
          case "code":
            comparison = a.code.localeCompare(b.code)
            break
          case "expiryDate":
            comparison = new Date(a.expiryDate) - new Date(b.expiryDate)
            break
          case "usageCount":
            comparison = a.usageCount - b.usageCount
            break
          case "discountValue":
            const valueA = a.discountPercent !== null ? a.discountPercent : a.discountAmount
            const valueB = b.discountPercent !== null ? b.discountPercent : b.discountAmount
            comparison = valueA - valueB
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
  }, [coupons, searchTerm, statusFilter, discountTypeFilter, sortField, sortDirection])

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar component */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Quản lý mã giảm giá</h1>
            <div className="flex gap-2">
              <button
                onClick={openAddModal}
                className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition"
              >
                <Plus className="w-4 h-4 mr-2" />
                Thêm mã giảm giá
              </button>
              <button
                onClick={fetchCoupons}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Làm mới
              </button>
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
                  placeholder="Tìm kiếm mã giảm giá..."
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
                  onClick={() => setStatusFilter("active")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    statusFilter === "active"
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  <Check className="w-4 h-4 mr-1" />
                  Đang hoạt động
                </button>
                <button
                  onClick={() => setStatusFilter("inactive")}
                  className={`flex items-center px-3 py-2 rounded-lg ${
                    statusFilter === "inactive" ? "bg-red-600 text-white" : "bg-red-100 text-red-700 hover:bg-red-200"
                  }`}
                >
                  <X className="w-4 h-4 mr-1" />
                  Vô hiệu
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              {/* Lọc theo loại giảm giá */}
              <div className="w-full md:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại giảm giá</label>
                <select
                  value={discountTypeFilter}
                  onChange={(e) => setDiscountTypeFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">Tất cả</option>
                  <option value="percent">Phần trăm (%)</option>
                  <option value="amount">Số tiền cố định</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bảng dữ liệu */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Đang tải dữ liệu mã giảm giá...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center text-red-500">
                <p>{error}</p>
              </div>
            ) : filteredCoupons.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>Không tìm thấy mã giảm giá nào phù hợp với bộ lọc.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("couponId")}
                      >
                        <div className="flex items-center">
                          ID
                          {sortField === "couponId" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("code")}
                      >
                        <div className="flex items-center">
                          Mã giảm giá
                          {sortField === "code" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("expiryDate")}
                      >
                        <div className="flex items-center">
                          Ngày hết hạn
                          {sortField === "expiryDate" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("usageCount")}
                      >
                        <div className="flex items-center">
                          Lượt sử dụng
                          {sortField === "usageCount" &&
                            (sortDirection === "asc" ? (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => toggleSort("discountValue")}
                      >
                        <div className="flex items-center">
                          Giảm giá
                          {sortField === "discountValue" &&
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
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredCoupons.map((coupon) => {
                      const expired = isExpired(coupon.expiryDate)
                      const usageLimit = coupon.usageCount >= coupon.maxUsageCount

                      return (
                        <tr key={coupon.couponId} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{coupon.couponId}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {coupon.code}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                              <span className={expired ? "text-red-500" : ""}>{formatDateTime(coupon.expiryDate)}</span>
                              {expired && (
                                <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                                  Hết hạn
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className={usageLimit ? "text-red-500" : ""}>
                                {coupon.usageCount} / {coupon.maxUsageCount}
                              </span>
                              {usageLimit && (
                                <span className="ml-2 px-1.5 py-0.5 bg-red-100 text-red-800 text-xs rounded">
                                  Đã hết
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div className="flex items-center">
                              <Tag className="w-4 h-4 mr-1 text-gray-400" />
                              {coupon.discountPercent !== null ? (
                                <span className="text-blue-600 font-medium">{coupon.discountPercent}%</span>
                              ) : (
                                <span className="text-green-600 font-medium">
                                  {formatCurrency(coupon.discountAmount)}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {coupon.isActive ? (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Hoạt động
                              </span>
                            ) : (
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Vô hiệu
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(coupon.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openEditModal(coupon)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => openToggleStatusConfirm(coupon)}
                              className={`${
                                coupon.isActive
                                  ? "text-red-600 hover:text-red-900"
                                  : "text-green-600 hover:text-green-900"
                              }`}
                            >
                              {coupon.isActive ? <X className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                            </button>
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
              Hiển thị {filteredCoupons.length} / {coupons.length} mã giảm giá
            </div>
          </div>
        </div>
      </div>

      {/* Modal thêm/sửa mã giảm giá */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">{isEditing ? "Chỉnh sửa mã giảm giá" : "Thêm mã giảm giá mới"}</h2>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Mã giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mã giảm giá <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleFormChange}
                    disabled={isEditing} // Không cho phép sửa mã khi đang chỉnh sửa
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100 disabled:text-gray-500"
                    placeholder="Ví dụ: SUMMER20"
                    required
                    maxLength={20}
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">Không thể thay đổi mã giảm giá sau khi đã tạo</p>
                  )}
                </div>

                {/* Ngày hết hạn */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày hết hạn <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    min={new Date().toISOString().split("T")[0]} // Không cho phép chọn ngày trong quá khứ
                  />
                </div>

                {/* Số lượt sử dụng tối đa */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượt sử dụng tối đa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="maxUsageCount"
                    value={formData.maxUsageCount}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    required
                    min={1}
                  />
                  {isEditing && (
                    <p className="text-xs text-gray-500 mt-1">Đã sử dụng: {selectedCoupon?.usageCount || 0} lượt</p>
                  )}
                </div>

                {/* Loại giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giảm giá <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="discountType"
                        value="percent"
                        checked={formData.discountType === "percent"}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      Phần trăm (%)
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="discountType"
                        value="amount"
                        checked={formData.discountType === "amount"}
                        onChange={handleFormChange}
                        className="mr-2"
                      />
                      Số tiền cố định
                    </label>
                  </div>
                </div>

                {/* Giá trị giảm giá */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Giá trị giảm giá <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                      min={1}
                      max={formData.discountType === "percent" ? 100 : undefined}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      {formData.discountType === "percent" ? "%" : "đ"}
                    </div>
                  </div>
                  {formData.discountType === "percent" && <p className="text-xs text-gray-500 mt-1">Tối đa 100%</p>}
                </div>

                {/* Trạng thái */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label className="ml-2 block text-sm text-gray-900">Kích hoạt mã giảm giá</label>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang lưu..." : isEditing ? "Cập nhật" : "Thêm mới"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal xác nhận */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />
              <h2 className="text-xl font-bold">Xác nhận</h2>
            </div>

            <p className="mb-6">{confirmMessage}</p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={() => confirmAction()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CouponManager

