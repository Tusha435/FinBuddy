from flask import Blueprint, request, jsonify
from langchain_openai import OpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from config import Config
import json

chat_bp = Blueprint('chat', __name__)

# Initialize AI components with error handling
memory = ConversationBufferMemory()
llm = None
conversation = None

def init_ai():
    global llm, conversation
    try:
        if Config.OPENAI_API_KEY:
            llm = OpenAI(temperature=0.7, api_key=Config.OPENAI_API_KEY)
            conversation = ConversationChain(llm=llm, memory=memory, verbose=True)
            print("AI chat initialized successfully")
        else:
            print("No OpenAI API key found - AI chat will use fallback responses")
    except Exception as e:
        print(f"AI initialization failed: {e} - Using fallback responses")

@chat_bp.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        user_context = data.get('user_context', {})
        
        # Use AI if available, otherwise use fallback responses
        if conversation:
            context_prompt = f"""
            You are FinBuddy, an expert AI financial literacy coach specialized in Indian financial markets and systems for young Indians (16-25).
            
            User Profile: {json.dumps(user_context)}
            
            IMPORTANT: Always provide India-specific advice covering:
            
            🏦 BANKING & SAVINGS:
            - Indian bank account types (Savings, Current, FD, RD)
            - Best Indian banks for students/professionals (SBI, HDFC, ICICI, etc.)
            - Digital banking apps (Google Pay, PhonePe, Paytm)
            - Interest rates in Indian context (6-8% for savings)
            
            📈 INVESTMENT OPTIONS:
            - Mutual Funds (SIP starting ₹500)
            - Stock Market basics (NSE, BSE)
            - Government schemes (PPF, EPF, NSC, ELSS)
            - Gold investments (Digital Gold, Gold ETFs)
            - Cryptocurrency regulations in India
            
            🛡️ INSURANCE:
            - Health insurance importance in India
            - Term life insurance
            - Two-wheeler/car insurance
            - Crop insurance for rural areas
            
            💰 GOVERNMENT SCHEMES:
            - PM Kisan Samman Nidhi
            - Atal Pension Yojana
            - Sukanya Samriddhi Yojana
            - Jan Dhan Yojana benefits
            - Pradhan Mantri Mudra Yojana for entrepreneurs
            
            💡 PRACTICAL TIPS:
            - Tax saving under Section 80C
            - Building CIBIL credit score
            - Festival budgeting (Diwali, weddings)
            - Dealing with inflation in Indian context
            - Emergency fund = 6-12 months expenses (higher due to job market volatility)
            
            Always provide:
            1. Actionable steps with specific Indian amounts (₹)
            2. Relevant government schemes/apps
            3. Cultural context (joint family expenses, festivals)
            4. Risk warnings for investments
            5. Simple language with Hindi terms when helpful
            
            User Question: {message}
            
            Respond in a friendly, encouraging tone with emoji usage and practical examples.
            """
            
            response = conversation.predict(input=context_prompt)
        else:
            # Fallback responses for common questions
            response = get_fallback_response(message.lower(), user_context)
        
        return jsonify({
            "message": response,
            "status": "success"
        })
    except Exception as e:
        return jsonify({"error": str(e), "status": "error"}), 500

def get_fallback_response(message, user_context):
    """Provide comprehensive Indian financial advice when AI is not available"""
    
    if any(word in message for word in ['save', 'saving', 'money']):
        return """💰 Smart Saving Strategies for Indians:

🏦 BANK ACCOUNTS:
• SBI/HDFC/ICICI - Compare interest rates (6-8%)
• Zero balance accounts for students
• Auto-transfer from salary account

📱 DIGITAL TOOLS:
• Google Pay/PhonePe for expense tracking
• Bank apps for automatic SIPs
• ET Money, Groww for investments

💡 INDIAN-SPECIFIC TIPS:
• Use festival bonuses for savings
• Invest Diwali gifts in mutual funds
• Take advantage of salary hikes - save 50% increment
• RD (Recurring Deposit) for discipline - ₹1,000/month

🎯 SAVINGS HIERARCHY:
1. Emergency fund (6-12 months expenses)
2. PPF (15-year lock-in, tax-free returns)
3. ELSS mutual funds (3-year lock, tax saving)
4. Equity mutual funds (long-term wealth)

Even ₹500/month SIP becomes ₹10+ lakhs in 15 years with 12% returns!"""

    elif any(word in message for word in ['investment', 'invest', 'stocks', 'mutual', 'fund']):
        return """📈 Investment Guide for Young Indians:

🎯 BEGINNER-FRIENDLY OPTIONS:
• SIP in Large Cap Mutual Funds - Start ₹500/month
• PPF - ₹500 to ₹1.5 lakh/year, tax-free returns
• ELSS - Tax saving + wealth creation
• Digital Gold - Buy ₹100 worth monthly

🏛️ GOVERNMENT SCHEMES:
• NPS - Additional ₹50,000 tax deduction
• NSC - Fixed returns with tax benefits
• Sukanya Samriddhi (for daughters)
• EPF - Employer matching, don't miss it!

📱 RECOMMENDED APPS:
• Zerodha/Upstox for stocks (₹20 per trade)
• Groww/ET Money for mutual funds
• Coin by Zerodha for SIPs

⚠️ IMPORTANT WARNINGS:
• Don't invest in crypto with borrowed money
• Avoid penny stocks and tips
• Never put emergency fund in equity
• Start with 70% debt, 30% equity allocation

💡 PRO TIP: Start SIP on salary date for consistency!"""

    elif any(word in message for word in ['insurance', 'health', 'term', 'life']):
        return """🛡️ Essential Insurance for Indians:

🏥 HEALTH INSURANCE (CRITICAL):
• Family floater - ₹5-10 lakh coverage
• Top-up plans for higher coverage
• Companies: Star Health, Max Bupa, HDFC Ergo
• Check network hospitals in your city

👨‍👩‍👧‍👦 LIFE INSURANCE:
• Term insurance - 10x annual income coverage
• Age 25: ₹1 crore cover for ₹8,000/year premium
• Companies: LIC, SBI Life, HDFC Life
• Avoid ULIPs, choose pure term plans

🚗 VEHICLE INSURANCE:
• Third-party mandatory by law
• Comprehensive covers own damage
• No-claim bonus saves premium
• Online renewals are cheaper

💰 GOVERNMENT INSURANCE:
• Ayushman Bharat (₹5 lakh coverage)
• PM-JAY for eligible families
• Atal Pension Yojana for retirement

✅ INSURANCE MANTRA: Buy term, invest the rest!"""

    elif any(word in message for word in ['emergency', 'fund']):
        return """🚨 Emergency Fund for Indians:

💰 TARGET AMOUNT:
• 6-12 months of expenses (higher than global standard)
• Include: rent, EMIs, groceries, utilities, medical
• Factor in joint family responsibilities

🏦 WHERE TO KEEP:
• Savings account - instant access
• FD with premature withdrawal facility
• Liquid mutual funds (T+1 redemption)
• 50-50 split between bank and liquid funds

🇮🇳 INDIA-SPECIFIC CONSIDERATIONS:
• Job market volatility - higher emergency needs
• Medical emergencies (family obligations)
• Festival season expenses
• Monsoon/natural calamity preparedness

💡 BUILDING STRATEGY:
1. Start with ₹10,000 target
2. Auto-transfer ₹2,000/month post-salary
3. Use annual bonus/increment for quick build-up
4. Don't touch for non-emergencies (tempting sales!)

🎯 What qualifies as emergency:
✅ Job loss, medical bills, family crisis, home repairs
❌ Festivals, shopping, vacations, gadgets"""

    elif any(word in message for word in ['budget', 'budgeting', 'expense']):
        return """📊 Smart Budgeting for Indian Youth:

🏠 INDIAN FAMILY BUDGET MODEL:
• 30% - Needs (rent, groceries, utilities)
• 20% - Family support/responsibilities  
• 20% - Savings & investments
• 20% - Wants (entertainment, dining out)
• 10% - Emergency/unexpected expenses

📱 EXPENSE TRACKING APPS:
• ET Money - Automatic expense categorization
• Walnut - SMS-based expense tracking
• YNAB - Zero-based budgeting
• Simple Excel/Google Sheets work too!

🎯 BUDGETING HACKS:
• Use UPI transaction history for analysis
• Set separate accounts for different goals
• Use credit card rewards points wisely
• Plan for festivals 6 months in advance

💸 COST-CUTTING TIPS:
• Cook at home - saves ₹5,000+/month
• Use public transport/carpooling
• Buy generic medicines
• Cancel unused subscriptions (Netflix, gym)
• Shop during sale seasons only

🎉 FESTIVAL BUDGETING:
• Diwali: ₹15,000 (gifts, celebration, shopping)
• Wedding season: ₹25,000 (clothes, gifts, travel)
• Start saving 8-10 months in advance!"""

    elif any(word in message for word in ['tax', 'section', '80c', 'savings']):
        return """💰 Tax Saving Guide for Indians:

📋 SECTION 80C (₹1.5 LAKH LIMIT):
• EPF contribution - Automatic deduction
• ELSS Mutual Funds - Best tax-saving option
• PPF - 15-year lock-in, tax-free returns
• Life Insurance premium - Term plans only
• Home loan principal repayment
• NSC, FD (5-year tax-saver)

💊 ADDITIONAL DEDUCTIONS:
• 80D: Health insurance premium (₹25,000)
• 80CCD: NPS additional (₹50,000)
• 80TTA: Savings account interest (₹10,000)
• 80G: Donations to PM-CARES, etc.

🎯 OPTIMAL TAX STRATEGY:
1. Max out EPF first (employer matching)
2. ELSS SIP for remaining 80C limit
3. Health insurance for family
4. NPS if in higher tax bracket

💡 TIMING TIPS:
• Start SIPs in April (not March rush)
• Spread investments throughout the year
• Keep investment proofs ready
• Use new tax regime if no deductions

⚠️ AVOID: Insurance as investment, closing PPF early, panic March investments"""

    elif any(word in message for word in ['goal', 'dream', 'target', 'plan']):
        return """🎯 Goal-Based Financial Planning:

💍 COMMON INDIAN FINANCIAL GOALS:
• Marriage (₹10-25 lakhs) - 3-7 years
• House down payment (₹20-50 lakhs) - 5-10 years
• Child education (₹25+ lakhs) - 15-20 years
• Parents' healthcare (₹10+ lakhs) - Emergency fund
• Retirement (₹5+ crores) - 30-40 years
• International vacation (₹2-5 lakhs) - 1-2 years

📊 GOAL-BASED ALLOCATION:
• <3 years: Debt funds, FD, RD
• 3-5 years: Hybrid mutual funds
• 5-7 years: Balanced funds
• >7 years: Equity mutual funds
• >15 years: Direct equity, growth stocks

🏛️ GOVERNMENT SCHEMES ALIGNMENT:
• Child goals: Sukanya Samriddhi Yojana
• Retirement: NPS + EPF combination
• Tax saving: ELSS + PPF combo
• Emergency: Jan Dhan account benefits

💡 SMART GOAL TECHNIQUES:
• Use different bank accounts for each goal
• Name your SIPs after goals (motivation!)
• Review and adjust every 6 months
• Celebrate milestones (25%, 50%, 75%)

🎉 INDIAN CONTEXT TIPS:
• Plan for festival expenses annually
• Factor in family wedding contributions
• Consider joint family responsibilities
• Plan for parents' medical needs"""

    elif any(word in message for word in ['crypto', 'bitcoin', 'cryptocurrency']):
        return """₿ Cryptocurrency in India - Complete Guide:

⚖️ LEGAL STATUS (2024):
• Legal to hold and trade crypto
• 30% tax on crypto gains (highest slab)
• 1% TDS on crypto transactions
• No set-off against other income/losses

💰 TAX IMPLICATIONS:
• All gains taxed at 30% (no exemption limit)
• 1% TDS deducted by exchanges
• No deduction for transaction costs
• Losses cannot offset other income

🏦 TRUSTED INDIAN EXCHANGES:
• WazirX (most popular)
• CoinDCX (comprehensive)
• Zebpay (user-friendly)
• Coinswitch Kuber

⚠️ INVESTMENT WARNINGS:
• Extremely volatile (can lose 90% value)
• No investor protection
• Regulatory risks
• Don't invest more than 5% of portfolio
• Never take loans for crypto

💡 SAFER CRYPTO APPROACH:
• Start with ₹500/month SIP
• Stick to Bitcoin/Ethereum only
• Use Dollar Cost Averaging
• Hold for 3+ years minimum
• Keep proper tax records

🎯 BETTER ALTERNATIVES:
• Gold ETFs for inflation hedge
• International mutual funds
• REITs for real estate exposure
• Direct equity for growth"""

    else:
        return f"""🙏 Namaste! I'm FinBuddy, your comprehensive Indian financial advisor! 

👤 Your Profile: {user_context.get('status', 'User').title()}, Income: {user_context.get('monthly_income_range', 'Not specified')}

🇮🇳 I specialize in INDIAN financial landscape:

🏦 BANKING & SAVINGS:
• Best bank accounts for your profile
• FD vs RD vs Savings account strategies
• Digital payment optimization

📈 INVESTMENTS:
• Mutual funds SIP guidance
• Stock market basics (NSE/BSE)
• Government schemes (PPF, ELSS, NPS)
• Tax-saving strategies (80C, 80D)

🛡️ INSURANCE:
• Health insurance recommendations
• Term life insurance planning
• Vehicle insurance optimization

💰 GOVERNMENT SCHEMES:
• PM Kisan, Atal Pension Yojana
• Jan Dhan benefits, Mudra loans
• Sukanya Samriddhi for daughters

🎯 GOAL PLANNING:
• Marriage, house, child education
• Retirement planning
• Emergency fund building

💡 Ask me about:
"Best SIP for ₹2000/month", "Health insurance for family", "Tax saving options", "Emergency fund size", "Home loan vs rent", "Crypto investment in India"

Ready to help with your financial journey! 🚀"""