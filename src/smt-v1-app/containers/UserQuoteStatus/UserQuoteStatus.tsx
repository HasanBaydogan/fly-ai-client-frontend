import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Modal,
  Tab,
  Table,
  Form,
  Row,
  Col
} from 'react-bootstrap';
import useWizardForm from 'hooks/useWizardForm';
import { getUserQuoteStats } from 'smt-v1-app/services/QuoteService';
import './UserQuoteStatus.css';

interface DailyQuoteData {
  user: string;
  dailyQuotes: number[];
  totalQuote: number;
}

interface QuoteResponse {
  data: DailyQuoteData[];
  message: string;
  statusCode: number;
  success: boolean;
  timestamp: number;
}

const UserQuoteStatus = () => {
  const [quoteData, setQuoteData] = useState<DailyQuoteData[]>([]);
  const [loading, setLoading] = useState(true);

  // Tarih seçimi için state'ler
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // Yıl listesi oluştur (örn: mevcut yıl ve önceki 2 yıl)
  const years = Array.from({ length: 3 }, (_, i) => selectedYear - i);

  // Ay listesi
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const fetchQuoteData = async (month: number, year: number) => {
    setLoading(true);
    try {
      const response = await getUserQuoteStats(month, year);
      if (response.success) {
        setQuoteData(response.data);
      }
    } catch (error) {
      console.error('Error fetching quote data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuoteData(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear]);

  // Renk skalası için yardımcı fonksiyon
  const calculateColumnAverage = (
    columnIndex: number,
    data: DailyQuoteData[]
  ): number => {
    const nonZeroValues = data
      .filter(row => row.user !== 'TOTAL') // Total satırını hariç tut
      .map(row => row.dailyQuotes[columnIndex])
      .filter(value => value > 0); // 0'ları filtrele

    if (nonZeroValues.length === 0) return 0;

    const sum = nonZeroValues.reduce((acc, curr) => acc + curr, 0);
    return sum / nonZeroValues.length;
  };
  const getBackgroundColor = (value: number): string => {
    if (value === 0) return 'transparent';
    if (value <= 5) return '#fee2e2'; // Pastel kırmızı
    if (value <= 10) return '#fde68a'; // Pastel sarı-turuncu
    if (value <= 15) return '#fef3c7'; // Pastel sarı
    if (value <= 20) return '#d9f99d'; // Açık pastel yeşil
    if (value <= 25) return '#bbf7d0'; // Pastel yeşil
    if (value <= 30) return '#86efac'; // Orta pastel yeşil
    if (value <= 35) return '#4ade80'; // Koyu pastel yeşil
    if (value <= 40) return '#34d399'; // Yeşil-turkuaz
    if (value >= 41) return '#10b981'; // En koyu yeşil
    return 'transparent';
  };

  // Total satırı için özel renk skalası
  const getTotalBackgroundColor = (
    columnIndex: number,
    data: DailyQuoteData[]
  ): string => {
    const average = calculateColumnAverage(columnIndex, data);
    return getBackgroundColor(average); // Aynı renk skalasını kullan ama ortalama değer için
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quote-status-container">
      {/* Tarih seçme modülü */}
      <div className="px-3">
        <Row className="date-selector mb-4">
          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label>Year</Form.Label>
              <Form.Select
                value={selectedYear}
                onChange={e => setSelectedYear(Number(e.target.value))}
              >
                {years.map(year => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label>Month</Form.Label>
              <Form.Select
                value={selectedMonth}
                onChange={e => setSelectedMonth(Number(e.target.value))}
              >
                {months.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </div>
      {/* Tablo */}
      <div className="table-container">
        <Table bordered className="quote-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Total</th>
              {Array.from({ length: 31 }, (_, i) => (
                <th key={i + 1}>{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quoteData.map((row, index) => (
              <tr
                key={index}
                className={row.user === 'TOTAL' ? 'total-row' : ''}
              >
                <td className="user-column">{row.user}</td>
                <td className="total-column">{row.totalQuote}</td>
                {row.dailyQuotes.map((quote, dayIndex) => (
                  <td
                    key={dayIndex}
                    style={{
                      backgroundColor:
                        row.user === 'TOTAL'
                          ? getTotalBackgroundColor(dayIndex, quoteData)
                          : getBackgroundColor(quote),
                      textAlign: 'center'
                    }}
                  >
                    {quote || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default UserQuoteStatus;
