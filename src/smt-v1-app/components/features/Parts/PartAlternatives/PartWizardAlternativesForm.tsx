import React, { useEffect, useState, useCallback } from 'react';
import { Table, Pagination, Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/free-solid-svg-icons';
import {
  getByAlternatives,
  getByAlternativesDetail
} from 'smt-v1-app/services/PartServices';
import PartHistoryListSection, {
  FormattedHistoryItem
} from 'smt-v1-app/components/features/Parts/PartsItemFields/HistoryList/PartHistoryListSection';
import PartTimelineGraph, {
  PartGraphItem
} from 'smt-v1-app/components/features/Parts/TimelineGraph/PartTimelineGraph';

interface AlternativePart {
  id: string;
  partNumber: string;
  partName: string;
  description: string;
}

interface PartWizardAlternativesFormProps {
  partId: string;
}

const PartWizardAlternativesForm: React.FC<PartWizardAlternativesFormProps> = ({
  partId
}) => {
  const [alternatives, setAlternatives] = useState<AlternativePart[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [alternativeDetail, setAlternativeDetail] = useState<any>(null);
  const [showHistorySection, setShowHistorySection] = useState<boolean>(false);

  // Alternatif parçaların listesini çekiyoruz.
  const fetchAlternatives = useCallback(async () => {
    if (!partId) return;
    setLoading(true);
    try {
      const response = await getByAlternatives(partId, currentPage);
      if (response && response.statusCode === 200 && response.data) {
        setAlternatives(response.data.alternativeParts || []);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching alternatives:', error);
    }
    setLoading(false);
  }, [partId, currentPage]);

  useEffect(() => {
    fetchAlternatives();
  }, [fetchAlternatives]);

  // Part Number tıklandığında detay verilerini çekiyoruz.
  const handlePartNumberClick = async (alternativeId: string) => {
    try {
      const response = await getByAlternativesDetail(alternativeId);
      if (response && response.statusCode === 200 && response.data) {
        setAlternativeDetail(response.data);
        setShowHistorySection(true);
      }
    } catch (error) {
      console.error('Error fetching alternative detail:', error);
    }
  };

  // Sayfalama kontrolü
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <div>Loading alternatives...</div>
      ) : (
        <>
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Part Name</th>
                <th>Description</th>
                <th style={{ width: '50px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map(alt => (
                <tr key={alt.id}>
                  <td>
                    <a
                      href="#"
                      onClick={e => {
                        e.preventDefault();
                        handlePartNumberClick(alt.id);
                      }}
                    >
                      {alt.partNumber}
                    </a>
                  </td>
                  <td>{alt.partName}</td>
                  <td>{alt.description}</td>
                  <td className="text-center">
                    <Dropdown>
                      <Dropdown.Toggle variant="link" className="p-0">
                        <FontAwesomeIcon icon={faEllipsisH} />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => handlePartNumberClick(alt.id)}
                        >
                          History
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            window.location.href = `/alternative-detail/${alt.id}`;
                          }}
                        >
                          Detail
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Sayfalama Alanı */}
          <div className="d-flex justify-content-end">
            <Pagination className="mb-0">
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              />
              {Array.from({ length: totalPages }, (_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={currentPage === index + 1}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              />
            </Pagination>
          </div>
        </>
      )}

      {/* History ve Timeline Bölümü: Başlangıçta gizli, Part Number tıklandığında görünür */}
      {showHistorySection && alternativeDetail && (
        <div style={{ marginTop: '20px' }}>
          <h5>History Details for Part: {alternativeDetail.partNumber}</h5>
          <PartHistoryListSection
            onContactsChange={() => {}}
            initialContacts={alternativeDetail.partHistoryItems || []}
          />
          {alternativeDetail.partGraphItems && (
            <>
              <h6>Timeline Graph</h6>
              <PartTimelineGraph
                graphData={alternativeDetail.partGraphItems as PartGraphItem[]}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PartWizardAlternativesForm;
