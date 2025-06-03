// src/app/admin/payments/page.js
"use client";

import { useState } from "react";
import { MainLayout } from "../../../components/layout/MainLayout";
import { CreditCard, DollarSign, TrendingUp, Download, Eye, CheckCircle, XCircle } from "lucide-react";
import { useGetAllPayments } from "../../../components/hooks/payment/useGetAllPayments";
import { useUpdatePaymentStatus } from "../../../components/hooks/payment/useUpdatePaymentStatus";

export default function AdminPaymentsPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    payment_status: "",
    payment_method: "",
    start_date: "",
    end_date: ""
  });

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const { data, isLoading, error, refetch } = useGetAllPayments(filters);
  const updateStatusMutation = useUpdatePaymentStatus();

  const handleStatusUpdate = async (paymentId, status, notes = "") => {
    try {
      await updateStatusMutation.mutateAsync({ id: paymentId, status, notes });
      refetch();
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const showPaymentDetails = (payment) => {
    setSelectedPayment(payment);
    setShowDetailsModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-green-100 text-green-800',
      'failed': 'bg-red-100 text-red-800',
      'refunded': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getMethodColor = (method) => {
    const colors = {
      'credit_card': 'bg-blue-100 text-blue-800',
      'paypal': 'bg-indigo-100 text-indigo-800',
      'bank_transfer': 'bg-green-100 text-green-800',
      'cash': 'bg-gray-100 text-gray-800'
    };
    return colors[method] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    if (!data?.payments?.length) return;
    
    const headers = ['ID', 'Booking ID', 'Customer', 'Amount', 'Method', 'Status', 'Date'];
    const csvData = data.payments.map(payment => [
      payment.id,
      payment.booking_id,
      payment.booking?.user?.full_name || 'N/A',
      payment.amount,
      payment.payment_method,
      payment.payment_status,
      formatDate(payment.created_at)
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate summary stats
  const calculateStats = () => {
    if (!data?.payments) return null;
    
    const total = data.payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
    const completed = data.payments.filter(p => p.payment_status === 'completed');
    const pending = data.payments.filter(p => p.payment_status === 'pending');
    const failed = data.payments.filter(p => p.payment_status === 'failed');
    
    return {
      totalRevenue: total,
      totalTransactions: data.payments.length,
      completedCount: completed.length,
      pendingCount: pending.length,
      failedCount: failed.length,
      averageTransaction: data.payments.length > 0 ? total / data.payments.length : 0
    };
  };

  const stats = calculateStats();

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments & Revenue</h1>
            <p className="text-gray-600">Track payments and financial reports</p>
          </div>
          <button 
            onClick={exportToCSV}
            disabled={!data?.payments?.length}
            className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-3 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition-all duration-200 inline-flex items-center disabled:opacity-50"
          >
            <Download className="h-5 w-5 mr-2" />
            Export Report
          </button>
        </div>

        {/* Revenue Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalTransactions}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Average Transaction</p>
                  <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.averageTransaction)}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <CreditCard className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.pendingCount}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg p-4 mb-6 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <select
              value={filters.payment_status}
              onChange={(e) => setFilters({...filters, payment_status: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select
              value={filters.payment_method}
              onChange={(e) => setFilters({...filters, payment_method: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
            </select>

            <input
              type="date"
              value={filters.start_date}
              onChange={(e) => setFilters({...filters, start_date: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Start Date"
            />

            <input
              type="date"
              value={filters.end_date}
              onChange={(e) => setFilters({...filters, end_date: e.target.value, page: 1})}
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="End Date"
            />

            <button
              onClick={() => setFilters({
                page: 1,
                limit: 10,
                payment_status: "",
                payment_method: "",
                start_date: "",
                end_date: ""
              })}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Payments List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
          {isLoading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading payments...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-600">Error loading payments: {error.message}</p>
            </div>
          ) : data?.payments?.length === 0 ? (
            <div className="p-8 text-center">
              <CreditCard className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No payments found</h3>
              <p className="text-gray-600">No payments match your current filters.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.payments?.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">#{payment.id}</div>
                          <div className="text-sm text-gray-500">{payment.transaction_id || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{payment.booking?.user?.full_name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">{payment.booking?.user?.email || 'N/A'}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">#{payment.booking_id}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getMethodColor(payment.payment_method)}`}>
                          {payment.payment_method?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(payment.payment_status)}`}>
                          {payment.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => showPaymentDetails(payment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {payment.payment_status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(payment.id, 'completed')}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Completed"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                          {payment.payment_status === 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(payment.id, 'failed')}
                              className="text-red-600 hover:text-red-900"
                              title="Mark as Failed"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {data?.pagination && (
            <div className="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing {((data.pagination.current_page - 1) * data.pagination.per_page) + 1} to{' '}
                {Math.min(data.pagination.current_page * data.pagination.per_page, data.pagination.total)} of{' '}
                {data.pagination.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setFilters({...filters, page: filters.page - 1})}
                  disabled={data.pagination.current_page === 1}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setFilters({...filters, page: filters.page + 1})}
                  disabled={data.pagination.current_page === data.pagination.total_pages}
                  className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payment Details Modal */}
        {showDetailsModal && selectedPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Payment Details #{selectedPayment.id}</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Payment Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Amount:</span> {formatCurrency(selectedPayment.amount)}</p>
                    <p><span className="font-medium">Method:</span> {selectedPayment.payment_method?.replace('_', ' ')}</p>
                    <p><span className="font-medium">Status:</span> 
                      <span className={`ml-1 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedPayment.payment_status)}`}>
                        {selectedPayment.payment_status}
                      </span>
                    </p>
                    <p><span className="font-medium">Transaction ID:</span> {selectedPayment.transaction_id || 'N/A'}</p>
                    <p><span className="font-medium">Date:</span> {formatDate(selectedPayment.created_at)}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Customer Information</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Name:</span> {selectedPayment.booking?.user?.full_name || 'N/A'}</p>
                    <p><span className="font-medium">Email:</span> {selectedPayment.booking?.user?.email || 'N/A'}</p>
                    <p><span className="font-medium">Booking ID:</span> #{selectedPayment.booking_id}</p>
                  </div>
                </div>
              </div>
              
              {selectedPayment.notes && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{selectedPayment.notes}</p>
                </div>
              )}

              <div className="mt-6 flex space-x-3">
                {selectedPayment.payment_status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedPayment.id, 'completed');
                        setShowDetailsModal(false);
                      }}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedPayment.id, 'failed');
                        setShowDetailsModal(false);
                      }}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      Mark as Failed
                    </button>
                  </>
                )}
                {selectedPayment.payment_status === 'completed' && (
                  <button
                    onClick={() => {
                      handleStatusUpdate(selectedPayment.id, 'refunded');
                      setShowDetailsModal(false);
                    }}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
                  >
                    Issue Refund
                  </button>
                )}
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}