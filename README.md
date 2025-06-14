# MERN Stack Application with Convex Backend

A comprehensive MERN stack application built with React, TypeScript, and Convex backend that provides admin authentication, agent management, and CSV upload/distribution functionality.

## Features

### 1. Admin User Login
- Secure authentication system with JWT-like functionality
- Default admin credentials: `admin@example.com` / `admin123`
- Session persistence with localStorage
- Protected routes and authentication state management

### 2. Agent Management
- Create, view, and delete agents
- Agent details include:
  - Name
  - Email (unique)
  - Mobile number with country code
  - Password
- Real-time agent list updates
- Input validation and error handling

### 3. CSV Upload & Distribution
- Upload CSV, XLS, or XLSX files
- Required columns: FirstName, Phone, Notes
- File format validation
- Data preview before processing
- Automatic distribution among agents:
  - Equal distribution of records
  - Remaining records distributed sequentially
- Real-time distribution preview
- Complete audit trail of uploads

### 4. Distributed Lists Management
- View all CSV uploads and their status
- Detailed distribution breakdown per agent
- Record-level visibility for each agent

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Convex (replaces traditional Express.js + MongoDB)
- **Styling**: TailwindCSS
- **Authentication**: Convex Auth
- **Real-time Updates**: Built-in with Convex
- **File Processing**: Client-side CSV parsing
- **Notifications**: Sonner toast notifications

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mern-stack-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Open your browser and navigate to the provided local server URL
   - Use default admin credentials: `admin@example.com` / `admin123`

### Environment Configuration

The application uses Convex for backend services, which automatically handles:
- Database provisioning
- Authentication setup
- Real-time subscriptions
- Environment variable management

No additional `.env` configuration is required for basic functionality.

## Usage Guide

### 1. Admin Login
- Navigate to the application
- Use the default credentials or create new admin users
- Upon successful login, you'll be redirected to the dashboard

### 2. Managing Agents
- Go to the "Agent Management" tab
- Click "Add Agent" to create new agents
- Fill in all required fields (name, email, mobile, password)
- View all agents in the table
- Delete agents as needed

### 3. Uploading and Distributing CSV Files
- Navigate to the "CSV Upload" tab
- Select a CSV, XLS, or XLSX file with the required format:
  ```
  FirstName,Phone,Notes
  John,+1234567890,Sample note
  Jane,+0987654321,Another note
  ```
- Preview the data and distribution plan
- Click "Upload & Distribute" to process the file
- Records will be automatically distributed among all available agents

### 4. Viewing Distributed Lists
- Go to the "Distributed Lists" tab
- View all uploaded CSV files and their processing status
- Click "View Distribution" to see how records were assigned to each agent
- Review individual records assigned to each agent

## File Structure

```
src/
├── components/
│   ├── AgentManagement.tsx    # Agent CRUD operations
│   ├── CsvUpload.tsx          # File upload and processing
│   ├── Dashboard.tsx          # Main dashboard layout
│   ├── DistributedLists.tsx   # Distribution viewing
│   └── LoginForm.tsx          # Authentication form
├── App.tsx                    # Main application component
└── main.tsx                   # Application entry point

convex/
├── adminAuth.ts               # Admin authentication functions
├── agents.ts                  # Agent management functions
├── csvUpload.ts               # CSV processing and distribution
└── schema.ts                  # Database schema definition
```

## API Functions

### Admin Authentication
- `createDefaultAdmin()` - Creates default admin user
- `adminLogin(email, password)` - Authenticates admin user
- `getCurrentAdmin(adminId)` - Retrieves admin details

### Agent Management
- `createAgent(agentData)` - Creates new agent
- `getAllAgents()` - Retrieves all agents
- `updateAgent(agentId, data)` - Updates agent information
- `deleteAgent(agentId)` - Removes agent

### CSV Processing
- `processCsvData(fileName, csvData, uploadedBy)` - Processes and distributes CSV data
- `getAllCsvUploads()` - Retrieves upload history
- `getDistributedLists(csvUploadId)` - Gets distribution details
- `getAgentRecords(agentId)` - Gets records assigned to specific agent

## Validation and Error Handling

### File Upload Validation
- File type validation (CSV, XLS, XLSX only)
- Required column validation
- Data format validation
- File size limits

### Form Validation
- Required field validation
- Email format validation
- Unique email constraints
- Password requirements

### Error Handling
- Comprehensive error messages
- Toast notifications for user feedback
- Graceful handling of network errors
- Input validation with real-time feedback

## Security Features

- Password-based authentication
- Session management
- Input sanitization
- File type validation
- Protected API endpoints

## Performance Optimizations

- Real-time updates without manual refresh
- Efficient data distribution algorithms
- Optimized file parsing
- Lazy loading of components
- Minimal re-renders with proper state management

## Future Enhancements

- Password hashing and encryption
- Role-based access control
- Advanced file format support
- Bulk agent operations
- Export functionality
- Advanced filtering and search
- Email notifications
- Audit logging

## Troubleshooting

### Common Issues

1. **File Upload Fails**
   - Ensure file format is CSV, XLS, or XLSX
   - Check that required columns (FirstName, Phone, Notes) are present
   - Verify file is not corrupted

2. **Agent Creation Fails**
   - Check that email is unique
   - Ensure all required fields are filled
   - Verify mobile number format

3. **Distribution Not Working**
   - Ensure at least one agent exists before uploading CSV
   - Check that CSV contains valid data
   - Verify file parsing was successful

### Support

For technical support or questions, please refer to the Convex documentation or contact the development team.

## License

This project is licensed under the MIT License.
#   M a c h i n e - T e s t - f o r - M E R N - S t a c k - D e v e l o p e r - 
 
 #   M a c h i n e - T e s t - f o r - M E R N - S t a c k - D e v e l o p e r -  
 #   M a c h i n e - T e s t - f o r - M E R N - S t a c k - D e v e l o p e r -  
 