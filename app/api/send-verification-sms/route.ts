/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

const SMS_API_KEY = process.env.SMS_019_API_KEY!
const SMS_API_URL = 'https://019sms.co.il/api/test' // Test
const SMS_USERNAME = process.env.SMS_019_USERNAME!
const SMS_FROM_NAME = process.env.SMS_019_FROM_NAME!

// 🔧 Enable local simulation mode (set to true to bypass real SMS service)
const LOCAL_SIMULATION = process.env.SMS_LOCAL_SIMULATION === 'true'

export async function POST(request: NextRequest) {
  try {
    const { phone, code } = await request.json()
    console.log('📱 Request body:', { phone, code })

    if (!phone) {
      console.log('❌ Validation failed: Phone is required')
      return NextResponse.json(
        { error: 'Phone is required' },
        { status: 400 }
      )
    }

    // 🧪 LOCAL SIMULATION MODE - For development/testing
    if (LOCAL_SIMULATION) {
      console.log('🧪 LOCAL SIMULATION MODE ENABLED')
      console.log('📞 Phone:', phone)
      
      // Generate a fake code if not provided
      const simulatedCode = code || Math.floor(100000 + Math.random() * 900000).toString()
      
      console.log('✅ Simulated SMS sent successfully!')
      console.log('📝 Verification Code:', simulatedCode)
      console.log('💡 Use this code in your OTP screen')
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      return NextResponse.json({ 
        success: true, 
        code: simulatedCode,  // Return the code
        message: 'SMS sent successfully (SIMULATED)',
        simulation: true
      })
    }

    // 🌐 REAL SMS SERVICE - For production
    if (!SMS_API_KEY || !SMS_USERNAME || !SMS_FROM_NAME) {
      console.error('❌ Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error: Missing SMS credentials' },
        { status: 500 }
      )
    }

    const formattedPhone = phone.replace(/\D/g, '')
    console.log('📞 Formatted phone:', formattedPhone)

    const text = `Your Pagix verification code is: [code]`

    const smsData = {
      send_otp: {
        user: { 
          username: SMS_USERNAME 
        },
        phone: phone, 
        source: SMS_FROM_NAME,
        text: text
      }
    }

    console.log('📤 Sending SMS data:', JSON.stringify(smsData, null, 2))

    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMS_API_KEY}`
      },
      body: JSON.stringify(smsData)
    })

    const res = await response.json()
    console.log('📥 SMS API Response:', res)

    if (!response.ok) {
      console.error('❌ SMS API Error:', res)
      return NextResponse.json(
        { error: 'Failed to send SMS', details: res },
        { status: response.status }
      )
    }

    console.log('✅ SMS sent successfully!')

    // Extract the code from the API response
    // Adjust this based on your API's actual response structure
    const generatedCode = res?.code || res?.otp || res?.verification_code

    return NextResponse.json({ 
      success: true, 
      code: generatedCode,  // Return the code
      message: 'SMS sent successfully',
      response: res
    })

  } catch (error: any) {
    console.error('❌ Error in SMS API route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}