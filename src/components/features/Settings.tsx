// Toggle switch component
const ToggleSwitch = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between py-3">
      <span className="text-gray-700">{label}</span>
      <button
        type="button"
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${checked ? 'bg-primary' : 'bg-gray-200'}`}
        onClick={onChange}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

// Confirmation modal for destructive actions
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all duration-300 p-6">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 mb-6">{message}</p>
        </div>
        
        <div className="flex justify-center space-x-3">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="border-gray-300 text-gray-700"
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

// Export data card
const ExportDataCard = ({ onExport }) => (
  <Card className="card-hover">
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 rounded-full bg-primary/10 text-primary">
          <Download className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">Export Your Data</h3>
          <p className="text-sm text-gray-500 mb-4">Download all your study plan data as a JSON file for backup</p>
          <Button 
            variant="outline" 
            onClick={onExport}
            className="text-primary border-primary/20 hover:bg-primary/5"
          >
            Export Data
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
);