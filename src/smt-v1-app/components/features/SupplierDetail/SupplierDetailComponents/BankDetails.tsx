import { useState, useEffect } from 'react';
import { Col, Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { ColumnDef } from '@tanstack/react-table';
import AdvanceTable from './AdvanceTable';
import useAdvanceTable from 'hooks/useAdvanceTable';
import AdvanceTableProvider from 'providers/AdvanceTableProvider';
import RevealDropdown, {
  RevealDropdownTrigger
} from 'components/base/RevealDropdown';
import BankFormModal from '../BankFormModal/BankFormModal';

interface BankData {
  id?: string;
  bankName: string;
  branchCode: string;
  branchName: string;
  ibanNo: string;
  swiftCode: string;
}

interface BankListSectionProps {
  onBankAccountsChange: (accounts: BankData[]) => void;
  initialBankAccounts: BankData[];
}

// Bank List Section Component
const BankListSection = ({
  onBankAccountsChange,
  initialBankAccounts
}: BankListSectionProps) => {
  const [bankAccounts, setBankAccounts] = useState<BankData[]>(() => {
    if (initialBankAccounts && initialBankAccounts.length > 0) {
      return initialBankAccounts.map((account, index) => ({
        id: account.id || `temp-${Date.now()}-${index}`, // Generate ID if not present
        bankName: account.bankName,
        branchCode: account.branchCode,
        branchName: account.branchName,
        ibanNo: account.ibanNo,
        swiftCode: account.swiftCode
      }));
    }
    return [];
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bankToDelete, setBankToDelete] = useState<BankData | null>(null);
  const [showBankFormModal, setShowBankFormModal] = useState(false);
  const [editingBank, setEditingBank] = useState<BankData | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Bank accounts'ları istenen formata dönüştürüp parent'e gönder
  useEffect(() => {
    const formattedBankAccounts = bankAccounts.map(account => ({
      id: account.id,
      bankName: account.bankName,
      branchCode: account.branchCode,
      branchName: account.branchName,
      ibanNo: account.ibanNo,
      swiftCode: account.swiftCode
    }));
    onBankAccountsChange(formattedBankAccounts);
  }, [bankAccounts, onBankAccountsChange]);

  // → Bank account silme butonuna tıklanınca
  const handleDeleteClick = (bankAccount: BankData) => {
    setBankToDelete(bankAccount);
    setShowDeleteModal(true);
  };

  // → Bank account'un silinmesini onaylayın
  const confirmDelete = () => {
    setBankAccounts(prevAccounts =>
      prevAccounts.filter(b => b.id !== bankToDelete?.id)
    );
    setShowDeleteModal(false);
    setBankToDelete(null);
  };

  // → Bank account düzenleme butonuna tıklanınca
  const handleEditClick = (bankAccount: BankData) => {
    setEditingBank(bankAccount);
    setIsEditMode(true);
    setShowBankFormModal(true);
  };

  // → Bank form modal'dan gelen bank verilerini işle
  const handleBankFormSubmit = (banks: any[]) => {
    if (isEditMode && editingBank) {
      // Edit mode - update existing bank
      const updatedBank = banks[0]; // Take first bank from array
      setBankAccounts(prev =>
        prev.map(bank =>
          bank.id === editingBank.id
            ? {
                ...bank,
                bankName: updatedBank.bankName,
                branchCode: updatedBank.branchCode,
                branchName: updatedBank.branchName,
                ibanNo: updatedBank.ibanNo,
                swiftCode: updatedBank.swiftCode
              }
            : bank
        )
      );
    } else {
      // Add mode - add new banks
      const newBankAccounts = banks.map((bank, index) => ({
        id: `new-${Date.now()}-${index}`, // Generate unique ID for new banks
        bankName: bank.bankName,
        branchCode: bank.branchCode,
        branchName: bank.branchName,
        ibanNo: bank.ibanNo,
        swiftCode: bank.swiftCode
      }));

      setBankAccounts(prev => [...prev, ...newBankAccounts]);
    }

    // Reset edit mode and close modal
    setIsEditMode(false);
    setEditingBank(null);
    setShowBankFormModal(false);
  };

  // → Modal kapatıldığında edit mode'u sıfırla
  const handleModalHide = () => {
    setShowBankFormModal(false);
    setIsEditMode(false);
    setEditingBank(null);
  };

  // → Tablo için kolonlar
  const columns: ColumnDef<BankData>[] = [
    { accessorKey: 'bankName', header: 'Bank Name' },
    { accessorKey: 'branchName', header: 'Branch Name' },
    {
      accessorKey: 'branchCode',
      header: 'Branch Code'
    },
    {
      accessorKey: 'swiftCode',
      header: 'SWIFT Code'
    },
    {
      accessorKey: 'ibanNo',
      header: 'IBAN No'
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row: { original } }) => (
        <RevealDropdownTrigger>
          <RevealDropdown>
            <Dropdown.Item onClick={() => handleEditClick(original)}>
              Edit
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleDeleteClick(original)}>
              Delete
            </Dropdown.Item>
          </RevealDropdown>
        </RevealDropdownTrigger>
      ),
      meta: {
        headerProps: { style: { width: '7%' } },
        cellProps: { className: 'text-end' }
      }
    }
  ];

  const table = useAdvanceTable({
    data: bankAccounts,
    columns,
    selection: false,
    sortable: true
  });

  return (
    <Form>
      <Col md={12}>
        <div className="d-flex justify-content-between align-items-center">
          <Form.Group className="my-3 mx-5">
            <Form.Label className="fw-bold fs-7">Bank List</Form.Label>
          </Form.Group>

          {/* Yeni bank account ekleme butonu */}
          <Button variant="primary" onClick={() => setShowBankFormModal(true)}>
            New Bank
          </Button>
        </div>

        {/* Tablo */}
        <AdvanceTableProvider {...table}>
          <AdvanceTable
            tableProps={{
              size: 'sm',
              className: 'phoenix-table fs-9 mb-0 border-top border-translucent'
            }}
            rowClassName="hover-actions-trigger btn-reveal-trigger position-static"
          />
        </AdvanceTableProvider>

        {/* Bank Form Modal */}
        <BankFormModal
          show={showBankFormModal}
          onHide={handleModalHide}
          onSubmit={handleBankFormSubmit}
          initialBanks={
            editingBank
              ? [
                  {
                    bankName: editingBank.bankName,
                    branchName: editingBank.branchName,
                    branchCode: editingBank.branchCode,
                    swiftCode: editingBank.swiftCode,
                    ibanNo: editingBank.ibanNo,
                    currency: 'USD' // Default currency for existing banks
                  }
                ]
              : []
          }
        />

        {/* Silme Onay Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete bank{' '}
            <strong>{bankToDelete?.bankName}</strong>?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>
      </Col>
    </Form>
  );
};

export default BankListSection;
