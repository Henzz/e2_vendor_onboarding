import { NextRequest, NextResponse } from "next/server"

interface VendorData {
  // Step 1: Personal Information
  name: string
  email: string
  phone_number: string
  password: string
  password_confirmation: string

  // Step 2: Business Information
  business_name: string
  business_type: string
  business_description: string
  business_email: string
  business_phone: string
  business_address: string

  // Step 3: Legal & Tax Information
  tin_number: string
  trade_license_number: string
  tax_id: string

  // Step 4: Document Upload (handled as base64 or file paths)
  trade_license_doc?: string
  id_card_doc?: string
}

// Validation function
function validateVendorData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []

  // Required fields validation
  const requiredFields = [
    'name',
    'email',
    'phone_number',
    'password',
    'password_confirmation',
    'business_name',
    'business_type',
    'business_description',
    'business_email',
    'business_phone',
    'business_address',
    'tin_number',
    'trade_license_number',
    'tax_id'
  ]

  for (const field of requiredFields) {
    if (!data[field] || data[field].toString().trim() === '') {
      errors.push(`${field} is required`)
    }
  }

  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format')
  }

  if (data.business_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.business_email)) {
    errors.push('Invalid business email format')
  }

  // Phone validation (basic)
  if (data.phone_number && !/^[\+]?[1-9][\d]{0,15}$/.test(data.phone_number.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Invalid phone number format')
  }

  if (data.business_phone && !/^[\+]?[1-9][\d]{0,15}$/.test(data.business_phone.replace(/[\s\-\(\)]/g, ''))) {
    errors.push('Invalid business phone number format')
  }

  // Password validation
  if (data.password && data.password !== data.password_confirmation) {
    errors.push('Passwords do not match')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the incoming data
    const validation = validateVendorData(body)
    
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Validation failed', 
          errors: validation.errors 
        },
        { status: 400 }
      )
    }

    const vendorData: VendorData = body

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Trigger any business logic
    
    // For now, we'll just simulate a successful submission
    console.log('Vendor application received:', {
      name: vendorData.name,
      email: vendorData.email,
      business_name: vendorData.business_name,
      submittedAt: new Date().toISOString()
    })

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Generate a mock application ID
    const applicationId = `APP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    return NextResponse.json({
      success: true,
      message: 'Vendor application submitted successfully',
      data: {
        applicationId,
        name: vendorData.name,
        email: vendorData.email,
        business_name: vendorData.business_name,
        status: 'pending_review',
        submittedAt: new Date().toISOString(),
        estimatedReviewTime: '2-3 business days'
      }
    })

  } catch (error) {
    console.error('Error processing vendor application:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error. Please try again later.' 
      },
      { status: 500 }
    )
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  )
}
