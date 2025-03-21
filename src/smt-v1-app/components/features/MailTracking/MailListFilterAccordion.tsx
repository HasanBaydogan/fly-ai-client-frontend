import React, { useState, useRef, useEffect } from 'react';
import { Accordion, Button, Form } from 'react-bootstrap';
import LoadingAnimation from 'smt-v1-app/components/common/LoadingAnimation/LoadingAnimation';
import { getByMailFilterItems } from 'smt-v1-app/services/MailTrackingService';

interface MailListFilterAccordionProps {
  dateFrom: Date;
  onApplyFilters: (selectedFilters: Record<FilterKeys, string[]>) => void;
}

export type FilterKeys = 'from' | 'subjects' | 'dates' | 'activeSales' | 'nonR';

const initialSelectedFilters: Record<FilterKeys, string[]> = {
  from: [],
  subjects: [],
  dates: [],
  activeSales: [],
  nonR: []
};

const MailListFilterAccordion: React.FC<MailListFilterAccordionProps> = ({
  dateFrom,
  onApplyFilters
}) => {
  const [showAccordion, setShowAccordion] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [filterData, setFilterData] = useState<any>(null);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Accordion active key (only one open at a time)
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // Selected items per filter panel
  const [selectedFilters, setSelectedFilters] = useState<
    Record<FilterKeys, string[]>
  >(initialSelectedFilters);

  // Dışarı tıklanırsa akordiyonu kapat ve seçimleri resetle
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowAccordion(false);
        setActiveKey(null);
        resetSelectedFilters();
      }
    }
    if (showAccordion) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccordion]);

  // Reset tüm seçili checkbox’lar
  const resetSelectedFilters = () => {
    setSelectedFilters(initialSelectedFilters);
  };

  // Akordiyon açıldığında API'ye istek atarak filtre verilerini getir (dateFrom parametresi gönderiliyor)
  useEffect(() => {
    if (showAccordion) {
      async function fetchFilterData() {
        setLoadingFilters(true);
        try {
          // Tarihi "dd.mm.yyyy" formatına çeviriyoruz
          const day = dateFrom.getDate().toString().padStart(2, '0');
          const month = (dateFrom.getMonth() + 1).toString().padStart(2, '0');
          const year = dateFrom.getFullYear();
          const formattedDate = `${day}.${month}.${year}`;
          const response = await getByMailFilterItems(formattedDate);
          if (response && response.success) {
            setFilterData(response.data);
          }
        } catch (error) {
          console.error('Error fetching filter data', error);
        } finally {
          setLoadingFilters(false);
        }
      }
      fetchFilterData();
    }
  }, [showAccordion, dateFrom]);

  // Accordion onSelect handler: yalnızca 1 panel açık olacak, panel değiştiğinde checkboxlar resetlensin.
  const handleSelect = (eventKey: string | null) => {
    if (activeKey === eventKey) {
      setActiveKey(null);
      resetSelectedFilters();
    } else {
      setActiveKey(eventKey);
      resetSelectedFilters();
    }
  };

  // Checkbox change handler: seçimi güncelle
  const handleCheckboxChange = (
    filterKey: FilterKeys,
    item: string,
    checked: boolean
  ) => {
    setSelectedFilters(prev => {
      const current = prev[filterKey];
      let updated: string[];
      if (checked) {
        updated = [...current, item];
      } else {
        updated = current.filter(i => i !== item);
      }
      return { ...prev, [filterKey]: updated };
    });
  };

  // Render fonksiyonu: verilen filtre verisini liste olarak, her elemanın başında checkbox ile göster
  const renderListWithCheckboxes = (
    items: string[] | undefined,
    filterKey: FilterKeys
  ) => {
    if (!items || items.length === 0) {
      return <div>No data</div>;
    }
    return (
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0 }}>
          {items.map((item, index) => (
            <li key={index}>
              <Form.Check
                type="checkbox"
                id={`${filterKey}-${index}`}
                label={item}
                checked={selectedFilters[filterKey].includes(item)}
                onChange={e =>
                  handleCheckboxChange(filterKey, item, e.target.checked)
                }
              />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div
      className="filter-accordion"
      ref={containerRef}
      style={{ position: 'relative', display: 'inline-block' }}
    >
      <Button
        variant="outline-secondary"
        size="sm"
        onClick={() => setShowAccordion(prev => !prev)}
      >
        Filter
      </Button>

      {showAccordion && (
        <div
          className="filter-overlay"
          style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            backgroundColor: 'white',
            zIndex: 1050,
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            minWidth: '280px'
          }}
        >
          {loadingFilters ? (
            <div>
              <LoadingAnimation />
            </div>
          ) : (
            <>
              <Accordion activeKey={activeKey} onSelect={handleSelect}>
                <Accordion.Item eventKey="0">
                  <Accordion.Header>From</Accordion.Header>
                  <Accordion.Body>
                    {renderListWithCheckboxes(filterData?.froms, 'from')}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="1">
                  <Accordion.Header>Subject</Accordion.Header>
                  <Accordion.Body>
                    {renderListWithCheckboxes(filterData?.subjects, 'subjects')}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="2">
                  <Accordion.Header>RFQReferenceNumberId</Accordion.Header>
                  <Accordion.Body>
                    {renderListWithCheckboxes(
                      filterData?.rfqIdReferences,
                      'nonR'
                    )}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="3">
                  <Accordion.Header>Date Filter</Accordion.Header>
                  <Accordion.Body>
                    {renderListWithCheckboxes(filterData?.dates, 'dates')}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="4">
                  <Accordion.Header>Active Sales</Accordion.Header>
                  <Accordion.Body>
                    {renderListWithCheckboxes(
                      filterData?.activeSales,
                      'activeSales'
                    ) || <div>No data</div>}
                  </Accordion.Body>
                </Accordion.Item>

                <Accordion.Item eventKey="5">
                  <Accordion.Header>Non-R</Accordion.Header>
                  <Accordion.Body>
                    {renderListWithCheckboxes(filterData?.nonR, 'nonR') || (
                      <div>No data</div>
                    )}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
              <div className="mt-2 text-end">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onApplyFilters(selectedFilters)}
                >
                  Apply Filter
                </Button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MailListFilterAccordion;
