import React, { useEffect, useState } from 'react';
import {
  Button,
  Card,
  Modal,
  Tab,
  Table,
  Form,
  Row,
  Col,
  Dropdown
} from 'react-bootstrap';
import useWizardForm from 'hooks/useWizardForm';
import { getUserQuoteStats } from 'smt-v1-app/services/QuoteService';
import './UserQuoteStatus.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import UserQuoteChart from './UserQuoteChart';

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

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1
  );

  // Yıl listesi oluştur: mevcut yıldan -5 ile +3 yıl arası seçenekler (2020-2028)
  const years = Array.from(
    { length: currentYear + 3 - (currentYear - 5) + 1 },
    (_, i) => currentYear - 5 + i
  ).reverse();

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

  const calculateColumnAverage = (
    columnIndex: number,
    data: DailyQuoteData[]
  ): number => {
    const nonZeroValues = data
      .filter(row => row.user !== 'TOTAL')
      .map(row => row.dailyQuotes[columnIndex])
      .filter(value => value > 0);

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

  // User filtreleme için yeni state'ler
  const [allUsers, setAllUsers] = useState<string[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // API'den data geldiğinde user listesini güncelle
  useEffect(() => {
    if (quoteData.length > 0) {
      const users = quoteData
        .filter(data => data.user !== 'TOTAL')
        .map(data => data.user);
      setAllUsers(users);
      setSelectedUsers(users); // Default olarak hepsi seçili
    }
  }, [quoteData]);

  // Checkbox değişimini handle et
  const handleUserToggle = (user: string) => {
    setSelectedUsers(prev => {
      if (prev.includes(user)) {
        return prev.filter(u => u !== user);
      } else {
        return [...prev, user];
      }
    });
  };

  // Tüm kullanıcıları seç/kaldır
  const handleSelectAllUsers = (checked: boolean) => {
    setSelectedUsers(checked ? [...allUsers] : []);
  };

  // Filtrelenmiş data
  const filteredQuoteData = quoteData.filter(
    row => row.user === 'TOTAL' || selectedUsers.includes(row.user)
  );

  // Haftasonu kontrolü için yardımcı fonksiyon
  const isWeekend = (day: number): boolean => {
    const date = new Date(selectedYear, selectedMonth - 1, day);
    return date.getDay() === 0 || date.getDay() === 6; // 0: Pazar, 6: Cumartesi
  };

  // Sütun başlığı için stil belirleme
  const getHeaderStyle = (day: number): React.CSSProperties => ({
    backgroundColor: isWeekend(day) ? '#fee2e2' : '#f1f5f9',
    color: isWeekend(day) ? '#991b1b' : '#475569',
    fontWeight: isWeekend(day) ? '600' : '500'
  });

  // Hücre için arka plan rengi belirleme
  const getCellBackgroundColor = (
    quote: number,
    isTotal: boolean,
    dayIndex: number
  ): string => {
    // Temel renk
    let baseColor = isTotal
      ? getTotalBackgroundColor(dayIndex, quoteData)
      : getBackgroundColor(quote);

    // Eğer haftasonuysa ve değer 0 ise hafif kırmızı ton
    if (isWeekend(dayIndex + 1) && quote === 0) {
      return '#fef2f2';
    }

    // Haftasonu için renk tonu ayarlaması
    if (isWeekend(dayIndex + 1) && baseColor !== 'transparent') {
      // Mevcut renge hafif kırmızı ton ekle
      return `${baseColor}99`; // 99 hex alpha değeri
    }

    return baseColor;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="quote-status-container">
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
          <Col xs={12} md={6} lg={3}>
            <Form.Group>
              <Form.Label>Filter Users</Form.Label>
              <Dropdown className="user-filter-dropdown">
                <Dropdown.Toggle variant="outline-secondary" className="w-100">
                  <FontAwesomeIcon icon={faFilter} className="me-2" />
                  Users ({selectedUsers.length}/{allUsers.length})
                </Dropdown.Toggle>
                <Dropdown.Menu className="user-filter-menu">
                  <div className="px-3 py-2">
                    <Form.Check
                      type="checkbox"
                      label="Select All"
                      checked={selectedUsers.length === allUsers.length}
                      onChange={e => handleSelectAllUsers(e.target.checked)}
                      className="select-all-checkbox"
                    />
                    <hr className="my-2" />
                    {allUsers.map(user => (
                      <Form.Check
                        key={user}
                        type="checkbox"
                        label={user}
                        checked={selectedUsers.includes(user)}
                        onChange={() => handleUserToggle(user)}
                        className="user-checkbox"
                      />
                    ))}
                  </div>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* Mevcut tablo */}
      <div className="table-container">
        <Table bordered className="quote-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Total</th>
              {Array.from({ length: 31 }, (_, i) => (
                <th
                  key={i + 1}
                  style={getHeaderStyle(i + 1)}
                  className={isWeekend(i + 1) ? 'weekend-header' : ''}
                >
                  {i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredQuoteData.map((row, index) => (
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
                    // Haftasonu sütunlarının rengi değişmesi için
                    // style={{
                    //   backgroundColor: getCellBackgroundColor(
                    //     quote,
                    //     row.user === 'TOTAL',
                    //     dayIndex
                    //   ),
                    //   textAlign: 'center'
                    // }}
                  >
                    {quote || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Grafik bileşenini ekle */}
      <UserQuoteChart data={quoteData} selectedUsers={selectedUsers} />
    </div>
  );
};

export default UserQuoteStatus;
