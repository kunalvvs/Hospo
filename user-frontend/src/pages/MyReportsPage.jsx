import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Eye, Calendar, User, Activity, Heart, Droplet, FileBarChart } from 'lucide-react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';

const MyReportsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = {
    all: [
      {
        id: 'REP001',
        title: 'Complete Blood Count (CBC)',
        type: 'Lab Test',
        date: '20 Jun 2025',
        hospital: 'Apollo Diagnostics, Delhi',
        doctor: 'Dr. Priya Sharma',
        status: 'available',
        category: 'blood',
        fileSize: '2.4 MB',
        findings: 'Normal',
        icon: Droplet,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-100'
      },
      {
        id: 'REP002',
        title: 'ECG Report',
        type: 'Cardiology',
        date: '18 Jun 2025',
        hospital: 'Max Hospital, Delhi',
        doctor: 'Dr. Rajesh Kumar',
        status: 'available',
        category: 'cardio',
        fileSize: '1.8 MB',
        findings: 'Normal Sinus Rhythm',
        icon: Heart,
        iconColor: 'text-pink-500',
        iconBg: 'bg-pink-100'
      },
      {
        id: 'REP003',
        title: 'X-Ray Chest',
        type: 'Radiology',
        date: '15 Jun 2025',
        hospital: 'Fortis Hospital, Delhi',
        doctor: 'Dr. Amit Verma',
        status: 'available',
        category: 'imaging',
        fileSize: '3.2 MB',
        findings: 'Clear Lung Fields',
        icon: Activity,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100'
      },
      {
        id: 'REP004',
        title: 'Liver Function Test',
        type: 'Lab Test',
        date: '12 Jun 2025',
        hospital: 'SRL Diagnostics, Delhi',
        doctor: 'Dr. Sneha Patel',
        status: 'pending',
        category: 'blood',
        fileSize: '0 MB',
        findings: 'Pending',
        icon: Droplet,
        iconColor: 'text-orange-500',
        iconBg: 'bg-orange-100'
      },
      {
        id: 'REP005',
        title: 'Diabetes Screening',
        type: 'Lab Test',
        date: '10 Jun 2025',
        hospital: 'PathLab, Delhi',
        doctor: 'Dr. Anil Gupta',
        status: 'available',
        category: 'blood',
        fileSize: '1.5 MB',
        findings: 'HbA1c: 5.6% (Normal)',
        icon: Droplet,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100'
      }
    ],
    blood: [],
    cardio: [],
    imaging: []
  };

  // Filter reports by category
  reports.blood = reports.all.filter(r => r.category === 'blood');
  reports.cardio = reports.all.filter(r => r.category === 'cardio');
  reports.imaging = reports.all.filter(r => r.category === 'imaging');

  const ReportCard = ({ report }) => {
    const IconComponent = report.icon;
    
    return (
      <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-4 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Icon */}
          <div className={`w-16 h-16 md:w-20 md:h-20 ${report.iconBg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
            <IconComponent className={`w-8 h-8 md:w-10 md:h-10 ${report.iconColor}`} />
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
              <div>
                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1">
                  {report.title}
                </h3>
                <p className="text-sm md:text-base text-gray-600">{report.type}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium w-fit ${
                report.status === 'available' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {report.status === 'available' ? 'Available' : 'Pending'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3 mb-4">
              <div className="flex items-center text-sm md:text-base text-gray-700">
                <Calendar className="w-4 h-4 mr-2 text-[#234f83]" />
                <span>{report.date}</span>
              </div>
              <div className="flex items-center text-sm md:text-base text-gray-700">
                <User className="w-4 h-4 mr-2 text-[#234f83]" />
                <span>{report.doctor}</span>
              </div>
              <div className="flex items-center text-sm md:text-base text-gray-700 col-span-1 sm:col-span-2">
                <Activity className="w-4 h-4 mr-2 text-green-600" />
                <span>{report.hospital}</span>
              </div>
            </div>

            {/* Findings */}
            {report.findings && report.status === 'available' && (
              <div className="bg-blue-50 rounded-xl p-3 mb-4">
                <p className="text-xs md:text-sm text-gray-700">
                  <strong className="text-blue-700">Key Findings:</strong> {report.findings}
                </p>
              </div>
            )}

            {/* Actions */}
            {report.status === 'available' ? (
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <button
                  onClick={() => setSelectedReport(report)}
                  className="flex-1 bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Report
                </button>
                <button className="flex-1 bg-[#234f83] text-white py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
                <button className="sm:w-auto bg-purple-100 text-[#234f83] py-2.5 md:py-3 px-4 rounded-lg font-medium text-sm md:text-base hover:bg-purple-200 transition-colors">
                  Share
                </button>
              </div>
            ) : (
              <div className="bg-yellow-50 rounded-xl p-3 text-center">
                <p className="text-sm md:text-base text-yellow-700 font-medium">
                  Report will be available within 24 hours
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-[#234f83] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-green-100 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="font-medium text-sm md:text-base">Back</span>
          </button>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">My Reports</h1>
          <p className="text-sm md:text-base text-green-100 mt-2">Access your medical reports and test results</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8 pb-24 md:pb-8">
        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm p-2 mb-6 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({reports.all.length})
            </button>
            <button
              onClick={() => setActiveTab('blood')}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'blood'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Blood Tests ({reports.blood.length})
            </button>
            <button
              onClick={() => setActiveTab('cardio')}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'cardio'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Cardiology ({reports.cardio.length})
            </button>
            <button
              onClick={() => setActiveTab('imaging')}
              className={`flex-1 min-w-[100px] py-3 px-4 rounded-xl font-medium text-sm md:text-base transition-colors ${
                activeTab === 'imaging'
                  ? 'bg-[#234f83] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Imaging ({reports.imaging.length})
            </button>
          </div>
        </div>

        {/* Reports List */}
        <div>
          {reports[activeTab].length > 0 ? (
            reports[activeTab].map((report) => (
              <ReportCard key={report.id} report={report} />
            ))
          ) : (
            <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12 text-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-full mx-auto flex items-center justify-center mb-4">
                <FileText className="w-10 h-10 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">No Reports</h3>
              <p className="text-sm md:text-base text-gray-600 mb-6">You don't have any {activeTab} reports</p>
              <button
                onClick={() => navigate('/pathlab')}
                className="bg-[#234f83] text-white py-3 px-6 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors"
              >
                Book Lab Test
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Report Viewer Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-green-700 text-white p-6 md:p-8 rounded-t-2xl flex justify-between items-center z-10">
              <div>
                <h2 className="text-xl md:text-2xl font-bold">{selectedReport.title}</h2>
                <p className="text-sm md:text-base text-green-100 mt-1">{selectedReport.date}</p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-white hover:text-green-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 md:p-8">
              {/* Report Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Hospital</p>
                  <p className="text-base font-semibold text-gray-800">{selectedReport.hospital}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Doctor</p>
                  <p className="text-base font-semibold text-gray-800">{selectedReport.doctor}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Test Type</p>
                  <p className="text-base font-semibold text-gray-800">{selectedReport.type}</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-600 mb-1">Report Date</p>
                  <p className="text-base font-semibold text-gray-800">{selectedReport.date}</p>
                </div>
              </div>

              {/* Preview Placeholder */}
              <div className="bg-gray-100 rounded-2xl p-8 md:p-12 text-center mb-6 min-h-[400px] flex items-center justify-center">
                <div>
                  <FileBarChart className="w-16 h-16 md:w-20 md:h-20 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 text-sm md:text-base">Report Preview</p>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">Full report available for download</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 bg-[#234f83] text-white py-3 rounded-lg font-medium text-sm md:text-base hover:bg-green-700 transition-colors flex items-center justify-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download PDF
                </button>
                <button className="flex-1 bg-blue-100 text-[#234f83] py-3 rounded-lg font-medium text-sm md:text-base hover:bg-blue-200 transition-colors">
                  Share with Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
};

export default MyReportsPage;
