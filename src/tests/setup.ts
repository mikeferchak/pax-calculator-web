import '@testing-library/jest-dom';

// Mock localStorage for testing
const localStorageMock = {
	getItem: vi.fn(),
	setItem: vi.fn(),
	removeItem: vi.fn(),
	clear: vi.fn()
};

Object.defineProperty(window, 'localStorage', {
	value: localStorageMock
});

// Mock browser environment
Object.defineProperty(window, 'location', {
	value: {
		href: 'http://localhost:3000'
	},
	writable: true
});

// Reset mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
});

// Make localStorage mock available globally
global.localStorageMock = localStorageMock;
