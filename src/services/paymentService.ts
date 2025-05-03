interface Payment {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  reservationId: string;
  timestamp: string;
}

interface PaymentDetails {
  userId: string;
  amount: number;
  paymentMethodId: string;
  bookingDetails: {
    hotelId: string;
    roomId: string;
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

interface PaymentResult {
  success: boolean;
  error?: string;
  transactionId?: string;
}

export const paymentService = {
  // Ödeme oluşturma
  createPayment: (paymentData: Omit<Payment, 'id' | 'timestamp'>) => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const newPayment = {
      ...paymentData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    payments.push(newPayment);
    localStorage.setItem('payments', JSON.stringify(payments));
    return newPayment;
  },

  // Ödeme durumunu güncelleme
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const paymentIndex = payments.findIndex((p: Payment) => p.id === paymentId);
    if (paymentIndex !== -1) {
      payments[paymentIndex].status = status;
      localStorage.setItem('payments', JSON.stringify(payments));
      return payments[paymentIndex];
    }
    return null;
  },

  // Kullanıcının ödemelerini getirme
  getUserPayments: (userId: string) => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    return payments.filter((p: Payment) => p.userId === userId);
  },

  // Ödeme detaylarını getirme
  getPaymentDetails: (paymentId: string) => {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    return payments.find((p: Payment) => p.id === paymentId);
  },

  processPayment: async (details: PaymentDetails): Promise<PaymentResult> => {
    try {
      // Ödeme işlemi simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Başarılı ödeme simülasyonu
      const transactionId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Sadece ödeme işlemini simüle et, rezervasyon ekleme!
      return {
        success: true,
        transactionId
      };
    } catch (error: any) {
      console.error('Ödeme işlemi sırasında hata:', error);
      return {
        success: false,
        error: error.message || 'Ödeme işlemi sırasında bir hata oluştu'
      };
    }
  }
}; 