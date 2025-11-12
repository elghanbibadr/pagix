/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server'

const SMS_API_KEY = process.env.SMS_019_API_KEY!
// const SMS_API_URL = 'https://019sms.co.il/api' // Production
const SMS_API_URL = 'https://019sms.co.il/api/test' // Test
const SMS_USERNAME = process.env.SMS_019_USERNAME!
const SMS_FROM_NAME = process.env.SMS_019_FROM_NAME!

export async function POST(request: NextRequest) {

  
  try {
    if (!SMS_API_KEY || !SMS_USERNAME || !SMS_FROM_NAME) {
      console.error(' Missing environment variables')
      return NextResponse.json(
        { error: 'Server configuration error: Missing SMS credentials' },
        { status: 500 }
      )
    }
  

    const { phone, code } = await request.json()
    console.log(' Request body:', { phone, code })

    if (!phone) {
      console.log(' Validation failed')
      return NextResponse.json(
        { error: 'Phone and code are required' },
        { status: 400 }
      )
    }


    const formattedPhone = phone.replace(/\D/g, '')
    console.log('📞 Formatted phone:', formattedPhone)

    const valid_time = 10 // minutes the code will be valid
    const max_tries = 10
    const text = `Your Pagix verification code is: [code]`

    const smsData = {
      send_otp: {
        user: { 
          username: SMS_USERNAME 
        },
        phone: phone, // expects value like '05xxxxxxx' or '5xxxxxxx'
        source: SMS_FROM_NAME,
        valid_time: valid_time,
        max_tries: max_tries,
        text: text
      }
    }


    const response = await fetch(SMS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SMS_API_KEY}`
      },
      body: JSON.stringify(smsData)
    })

    const responseText = await response.text()
    console.log('  Response:', responseText)

    if (!response.ok) {
      console.error(' SMS API Error:', responseText)
      return NextResponse.json(
        { error: 'Failed to send SMS', details: responseText },
        { status: response.status }
      )
    }

    console.log('sms sent successfully!')
  

    return NextResponse.json({ 
      success: true, 
      message: 'SMS sent successfully',
      response: responseText 
    })

  } catch (error: any) {
    console.error(' Error in SMS API route:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    )
  }
}