// Simple test script to verify the API endpoint
const axios = require('axios');

const testData = {
  businessName: "Test Business",
  businessType: "retail",
  businessDescription: "A test business for API validation",
  businessEmail: "test@example.com",
  businessPhone: "+1 (555) 123-4567",
  streetAddress: "123 Test Street",
  city: "Test City",
  state: "TS",
  postalCode: "12345",
  country: "us",
  website: "https://test.com",
  taxId: "12-3456789",
  bankAccount: "1234",
  preferredCategories: ["Electronics", "Fashion"]
};

async function testAPI() {
  try {
    console.log('Testing vendor onboarding API...');
    
    const response = await axios.post('http://localhost:3000/api/vendor-onboarding', testData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('✅ API Test Successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ API Test Failed!');
    
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Error:', JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.log('Network Error:', error.message);
    } else {
      console.log('Error:', error.message);
    }
  }
}

// Test with invalid data
async function testAPIValidation() {
  try {
    console.log('\nTesting API validation with invalid data...');
    
    const invalidData = {
      businessName: "",
      businessEmail: "invalid-email",
      // Missing required fields
    };
    
    const response = await axios.post('http://localhost:3000/api/vendor-onboarding', invalidData, {
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('❌ Validation test failed - should have returned error');
    console.log('Response:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Validation Test Successful!');
      console.log('Validation errors:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.log('❌ Unexpected error in validation test');
      console.log('Error:', error.message);
    }
  }
}

// Run tests
if (require.main === module) {
  testAPI().then(() => {
    return testAPIValidation();
  }).then(() => {
    console.log('\n🎉 All tests completed!');
    process.exit(0);
  }).catch((error) => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}
