# IP to Country Lookup App

A Vue.js application that allows users to look up IP addresses and get their corresponding country information, including flags and local time.

## Features

- **IP Address Lookup**: Enter IPv4 or IPv6 addresses to get country information
- **Real-time Clock**: Displays the current time in the IP's timezone
- **Country Flags**: Shows the flag of the country where the IP is located
- **Single Active Row**: Only one IP row can be edited at a time for focused workflow
- **Smart Validation**: Validates IP addresses with 200ms delay to prevent premature errors
- **Click-outside Abandonment**: Click outside interactive elements to abandon editing
- **Error Handling**: Displays helpful error messages for invalid IPs or API failures

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **Testing**: Vitest with Vue Testing Library
- **Build Tool**: Vite
- **Styling**: CSS3

## API Services

- **IP Lookup**: [ipwho.is](https://ipwho.is/) - Provides country, timezone, and other IP information
- **Flags**: [flagcdn.com](https://flagcdn.com/) - Provides country flag images

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ip-to-country-app
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run serve` - Preview production build
- `npm run test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Usage

1. **Open the App**: Click "Open IP Lookup" to start
2. **Add IP Addresses**: Click "+ Add" to create new input fields
3. **Enter IPs**: Type valid IPv4 or IPv6 addresses in the input fields
4. **Search**: Click outside the input field to search (search happens on blur with 200ms delay)
5. **View Results**: See the country flag and local time for each IP
6. **Abandon Editing**: Click outside interactive elements to abandon current editing session
7. **Close**: Click the "×" button to close the app (clears all data)

## Project Structure

```
src/
├── components/
│   └── IpRow.vue          # Individual IP input row component
├── services/
│   └── ipService.ts       # API service for IP lookups
├── App.vue                # Main application component
├── main.ts               # Application entry point
└── style.css             # Global styles

tests/
├── App.test.ts           # Tests for main app component
├── IpRow.test.ts         # Tests for IP row component
├── ipService.test.ts     # Tests for IP service
└── setup.ts              # Test setup configuration
```

## Testing

The project includes comprehensive unit test coverage:

- **App.test.ts**: Tests the main application component
- **IpRow.test.ts**: Tests individual IP row components
- **ipService.test.ts**: Tests the IP lookup service

Run tests:

```bash
npm run test
npm run test:coverage
```

## Key Components

### App.vue

- Main application component
- Manages IP rows and active state

### IpRow.vue

- Individual IP input component
- Handles validation and API calls
- Displays results and errors

### ipService.ts

- API service for IP lookups

## How It Works

- **Single Active Row**: Only one IP row can be edited at a time
- **Search on Blur**: Search happens when you click outside the input field
- **Click Outside**: Click anywhere outside to abandon editing
- **Add Button**: Only enabled when no row is being edited

## Error Handling

- **Invalid IP Format**: Shows validation error for malformed IPs
- **Network Errors**: Handles connection failures gracefully
- **API Errors**: Displays specific error messages from the API