# 🌍 Restoration Marketplace - Feature Documentation

## Overview
The AgroReGen Restoration Marketplace connects landowners with investors for verified land restoration projects. It provides a comprehensive platform for funding regenerative agriculture and environmental restoration initiatives.

## 🎯 Key Features

### 1. Investment Platform
- **Direct Project Investment**: Invest in verified restoration projects with transparent funding goals
- **Minimum Investment Thresholds**: Clear minimum investment amounts ($2,500 - $10,000)
- **Investment Modal**: Detailed investment dialog with project information and investment input
- **Real-time Funding Progress**: Visual progress bars showing funding status

### 2. Advanced Search & Filtering
- **Search Functionality**: Search projects by name, location, or description
- **Project Type Filter**: Filter by:
  - Reforestation
  - Soil Restoration
  - Water Management
  - Biodiversity
- **Smart Sorting**: Sort projects by:
  - Funding Progress
  - Impact Score
  - Area Size

### 3. Project Details
Each project includes:
- **Basic Information**:
  - Title and description
  - Location (County/Region)
  - Area coverage (hectares)
  - Landowner information
  
- **Financial Details**:
  - Funding goal
  - Amount raised
  - Funding percentage
  - Number of investors
  - Minimum investment required

- **Impact Metrics**:
  - Impact Score (0-100)
  - Project type
  - Status (Seeking Funding, In Progress, Completed)

- **Timeline & Milestones**:
  - Start date
  - Estimated completion date
  - Project milestones with status indicators
  - Progress tracking

- **Contact Information**:
  - Landowner email
  - Phone number
  - Direct contact functionality

### 4. Project Status Management
- **Seeking Funding**: Active projects accepting investments
- **In Progress**: Funded projects currently being implemented
- **Completed**: Successfully finished restoration projects

### 5. Platform Statistics
Real-time dashboard showing:
- Total active projects (6+)
- Total hectares being restored (1,175 ha)
- Total investment raised ($3.0M+)
- Total number of investors (97+)

## 📊 Available Projects

### Kibwezi Forest Restoration Project
- **Location**: Kibwezi, Makueni County
- **Area**: 150 hectares
- **Goal**: $750,000 | Raised: $450,000 (60%)
- **Type**: Reforestation
- **Impact Score**: 92/100
- **Min Investment**: $5,000
- **Status**: Seeking Funding

### Narok Soil Health Recovery
- **Location**: Narok County
- **Area**: 200 hectares
- **Goal**: $500,000 | Raised: $500,000 (100%)
- **Type**: Soil Restoration
- **Impact Score**: 88/100
- **Min Investment**: $3,000
- **Status**: In Progress

### Kericho Watershed Management
- **Location**: Kericho County
- **Area**: 100 hectares
- **Goal**: $350,000 | Raised: $120,000 (34%)
- **Type**: Water Management
- **Impact Score**: 85/100
- **Min Investment**: $2,500
- **Status**: Seeking Funding

### Laikipia Biodiversity Corridor
- **Location**: Laikipia County
- **Area**: 250 hectares
- **Goal**: $900,000 | Raised: $900,000 (100%)
- **Type**: Biodiversity
- **Impact Score**: 95/100
- **Min Investment**: $10,000
- **Status**: Completed

### Meru Agroforestry Initiative
- **Location**: Meru County
- **Area**: 175 hectares
- **Goal**: $600,000 | Raised: $380,000 (63%)
- **Type**: Reforestation
- **Impact Score**: 90/100
- **Min Investment**: $4,000
- **Status**: Seeking Funding

### Kajiado Rangeland Restoration
- **Location**: Kajiado County
- **Area**: 300 hectares
- **Goal**: $800,000 | Raised: $650,000 (81%)
- **Type**: Soil Restoration
- **Impact Score**: 87/100
- **Min Investment**: $3,500
- **Status**: In Progress

## 🔧 Technical Implementation

### Components Used
- React with TypeScript
- Shadcn/UI components (Dialog, Card, Badge, Tabs)
- Lucide React icons
- Search and filter functionality
- Modal dialogs for investment

### User Flow
1. Browse projects on marketplace homepage
2. Use search/filter to find specific projects
3. Click "Invest" to view detailed project information
4. Review project milestones, timeline, and contact details
5. Enter investment amount (above minimum threshold)
6. Submit investment or contact landowner for more information

## 🎨 UI/UX Features
- Gradient backgrounds with emerald/teal theme
- Hover effects with card elevation
- Progress bars with smooth animations
- Status badges with color coding
- Responsive grid layout
- Interactive modal dialogs
- Real-time statistics cards

## 🚀 Future Enhancements
- Payment gateway integration
- Investor dashboard
- Project update notifications
- Carbon credit tracking
- Impact reporting
- Blockchain verification
- Smart contract integration
