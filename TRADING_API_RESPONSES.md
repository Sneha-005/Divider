# Trading API Test Cases & JSON Response Bodies

## Overview
All API responses return JSON format with `success` flag and structured error/data objects for easy UI parsing.

---

## Test Case 1: Sell Non-Owned Shares ❌

### Request
```json
POST /trading/trade
Content-Type: application/json
X-User-ID: test_user

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 10,
  "price": 2700,
  "type": "SELL"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_HOLDINGS",
    "message": "insufficient holdings: you have 0.00 shares of RELIANCE-CE-2900 but trying to sell 10.00",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 10,
      "price": 2700,
      "type": "SELL"
    }
  }
}
```

### UI Display Suggestion
```
❌ Cannot Sell
Error Code: INSUFFICIENT_HOLDINGS
Message: You have 0.00 shares of RELIANCE-CE-2900 but trying to sell 10.00
```

---

## Test Case 2: Sell More Than Owned ❌

### Step 1: Buy 10 shares (Success)
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 10,
  "price": 800,
  "type": "BUY"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 8000,
    "fee": 40,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 10,
    "price": 800,
    "type": "BUY"
  }
}
```

### Step 2: Try to sell 15 (Failure)
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 15,
  "price": 900,
  "type": "SELL"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_HOLDINGS",
    "message": "insufficient holdings: you have 10.00 shares of RELIANCE-CE-2900 but trying to sell 15.00",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 15,
      "price": 900,
      "type": "SELL"
    }
  }
}
```

### UI Display Suggestion
```
❌ Cannot Sell
Error Code: INSUFFICIENT_HOLDINGS
Message: You have 10.00 shares but trying to sell 15.00
Action: You can only sell up to 10 shares
```

---

## Test Case 3: Sell Exact Amount Owned ✅

### Step 1: Buy 10 shares
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 10,
  "price": 800,
  "type": "BUY"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 8000,
    "fee": 40,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 10,
    "price": 800,
    "type": "BUY"
  }
}
```

### Step 2: Sell all 10 shares ✅
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 10,
  "price": 900,
  "type": "SELL"
}
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 9000,
    "fee": 45,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 10,
    "price": 900,
    "type": "SELL"
  }
}
```

### UI Display Suggestion
```
✅ Sell Successful
Symbol: RELIANCE-CE-2900
Quantity: 10 shares
Price: ₹900 per share
Total: ₹9000
Fee: ₹45
Net Proceeds: ₹8955
```

---

## Test Case 4: Sell Partial Amount ✅

### Step 1: Buy 100 shares
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 100,
  "price": 100,
  "type": "BUY"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 10000,
    "fee": 50,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 100,
    "price": 100,
    "type": "BUY"
  }
}
```

### Step 2: Sell 60 shares ✅
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 60,
  "price": 120,
  "type": "SELL"
}
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 7200,
    "fee": 36,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 60,
    "price": 120,
    "type": "SELL"
  }
}
```

### Step 3: Check wallet to see remaining holdings
```json
GET /trading/wallet
X-User-ID: test_user
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user_id": "test_user",
    "total_balance": 100000,
    "available_cash": 99914,
    "invested_amount": 4000,
    "positions": {
      "RELIANCE-CE-2900": {
        "symbol": "RELIANCE-CE-2900",
        "quantity": 40,
        "average_cost": 100,
        "current_price": 120,
        "unrealized_pnl": 800,
        "percentage": 20
      }
    }
  }
}
```

### UI Display Suggestion
```
✅ Sell Successful
Sold: 60 shares @ ₹120
Proceeds: ₹7200
Fee: ₹36
Net Proceeds: ₹7164

Remaining Holdings:
RELIANCE-CE-2900: 40 shares
Average Cost: ₹100
Current Price: ₹120
Unrealized P&L: +₹800 (+20%)
```

---

## Test Case 5: Cannot Sell After Holdings Empty ❌

### Step 1: Buy 10 shares
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 10,
  "price": 100,
  "type": "BUY"
}
```

### Step 2: Sell all 10 shares ✅
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 10,
  "price": 120,
  "type": "SELL"
}
```

### Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 1200,
    "fee": 6,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 10,
    "price": 120,
    "type": "SELL"
  }
}
```

### Step 3: Try to sell again ❌
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 5,
  "price": 120,
  "type": "SELL"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_HOLDINGS",
    "message": "insufficient holdings: you have 0.00 shares of RELIANCE-CE-2900 but trying to sell 5.00",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 5,
      "price": 120,
      "type": "SELL"
    }
  }
}
```

### UI Display Suggestion
```
❌ Cannot Sell
Error Code: INSUFFICIENT_HOLDINGS
Message: You have 0.00 shares of RELIANCE-CE-2900
Action: No holdings to sell. Buy shares first to sell later.
```

---

## Test Case 6: Buy Insufficient Cash ❌

### Request
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 1000,
  "price": 200,
  "type": "BUY"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_CASH",
    "message": "insufficient cash: you have ₹100000.00 but need ₹201000.00",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 1000,
      "price": 200,
      "type": "BUY"
    }
  }
}
```

### Calculation Shown in Response
```
Stock Cost: 1000 × 200 = ₹200,000
Fee (0.5%): ₹1,000
Total Needed: ₹201,000
Your Cash: ₹100,000
Shortfall: ₹101,000
```

### UI Display Suggestion
```
❌ Insufficient Funds
Error Code: INSUFFICIENT_CASH
Need: ₹201,000.00
Have: ₹100,000.00
Shortfall: ₹101,000.00

Suggestion: Deposit more cash or reduce quantity to 500 shares
Maximum you can buy: 499 shares @ ₹200
```

---

## Test Case 7: Multiple Buys Then Sell ✅

### Step 1-3: Buy 30, 20, and 50 shares
```json
POST /trading/trade
{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 30,
  "price": 100,
  "type": "BUY"
}
```
Response: 200 OK ✅

```json
POST /trading/trade
{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 20,
  "price": 110,
  "type": "BUY"
}
```
Response: 200 OK ✅

```json
POST /trading/trade
{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 50,
  "price": 90,
  "type": "BUY"
}
```
Response: 200 OK ✅

### Step 4: Try to sell 150 (have 100) ❌
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 150,
  "price": 120,
  "type": "SELL"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_HOLDINGS",
    "message": "insufficient holdings: you have 100.00 shares of RELIANCE-CE-2900 but trying to sell 150.00",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 150,
      "price": 120,
      "type": "SELL"
    }
  }
}
```

### Step 5: Sell 75 shares ✅
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 75,
  "price": 120,
  "type": "SELL"
}
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 9000,
    "fee": 45,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 75,
    "price": 120,
    "type": "SELL"
  }
}
```

### Step 6: Check wallet
```json
GET /trading/wallet
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user_id": "test_user",
    "total_balance": 100000,
    "available_cash": 99920,
    "invested_amount": 2500,
    "positions": {
      "RELIANCE-CE-2900": {
        "symbol": "RELIANCE-CE-2900",
        "quantity": 25,
        "average_cost": 103.10,
        "current_price": 120,
        "unrealized_pnl": 423.75,
        "percentage": 4.11
      }
    }
  }
}
```

### UI Display Suggestion
```
Summary of Multiple Trades:
- BUY: 30 @ ₹100 ✓
- BUY: 20 @ ₹110 ✓
- BUY: 50 @ ₹90 ✓
Total Holdings: 100 shares
Average Cost: ₹103.10

Attempted to SELL 150 ❌ (Only have 100)
Then SELL: 75 @ ₹120 ✓

Remaining: 25 shares
Current Value: ₹3000
Unrealized P&L: +₹423.75 (+4.11%)
```

---

## Test Case 8: Multiple Symbols Independent ✅

### Step 1: Buy RELIANCE
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 50,
  "price": 100,
  "type": "BUY"
}
```
Response: 200 OK ✅

### Step 2: Buy TCS
```json
POST /trading/trade

{
  "symbol": "TCS-CE-3500",
  "quantity": 30,
  "price": 150,
  "type": "BUY"
}
```
Response: 200 OK ✅

### Step 3: Sell 40 RELIANCE ✅
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 40,
  "price": 120,
  "type": "SELL"
}
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "status": "Trade executed successfully",
    "total": 4800,
    "fee": 24,
    "symbol": "RELIANCE-CE-2900",
    "quantity": 40,
    "price": 120,
    "type": "SELL"
  }
}
```

### Step 4: Try to sell 50 TCS (have 30) ❌
```json
POST /trading/trade

{
  "symbol": "TCS-CE-3500",
  "quantity": 50,
  "price": 170,
  "type": "SELL"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_HOLDINGS",
    "message": "insufficient holdings: you have 30.00 shares of TCS-CE-3500 but trying to sell 50.00",
    "details": {
      "symbol": "TCS-CE-3500",
      "quantity": 50,
      "price": 170,
      "type": "SELL"
    }
  }
}
```

### Step 5: Check wallet
```json
GET /trading/wallet
```

### JSON Response (200 OK)
```json
{
  "success": true,
  "data": {
    "user_id": "test_user",
    "total_balance": 100000,
    "available_cash": 99921,
    "invested_amount": 8500,
    "positions": {
      "RELIANCE-CE-2900": {
        "symbol": "RELIANCE-CE-2900",
        "quantity": 10,
        "average_cost": 100,
        "current_price": 120,
        "unrealized_pnl": 200,
        "percentage": 20
      },
      "TCS-CE-3500": {
        "symbol": "TCS-CE-3500",
        "quantity": 30,
        "average_cost": 150,
        "current_price": 170,
        "unrealized_pnl": 600,
        "percentage": 4
      }
    }
  }
}
```

### UI Display Suggestion
```
Portfolio:
┌─────────────────────────────────────────────┐
│ RELIANCE-CE-2900                            │
│ Holdings: 10 shares | Avg: ₹100            │
│ P&L: +₹200 (+20%)                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ TCS-CE-3500                                 │
│ Holdings: 30 shares | Avg: ₹150            │
│ P&L: +₹600 (+4%)                           │
└─────────────────────────────────────────────┘

Cash: ₹99,921
Total Balance: ₹100,000
```

---

## Test Case 9: Invalid Quantity or Price ❌

### Request 1: Zero Quantity
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 0,
  "price": 100,
  "type": "BUY"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUANTITY_OR_PRICE",
    "message": "quantity and price must be positive",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 0,
      "price": 100,
      "type": "BUY"
    }
  }
}
```

---

### Request 2: Negative Quantity
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": -50,
  "price": 100,
  "type": "BUY"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUANTITY_OR_PRICE",
    "message": "quantity and price must be positive",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": -50,
      "price": 100,
      "type": "BUY"
    }
  }
}
```

---

### Request 3: Zero Price
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 50,
  "price": 0,
  "type": "BUY"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUANTITY_OR_PRICE",
    "message": "quantity and price must be positive",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 50,
      "price": 0,
      "type": "BUY"
    }
  }
}
```

---

### Request 4: Negative Price
```json
POST /trading/trade

{
  "symbol": "RELIANCE-CE-2900",
  "quantity": 50,
  "price": -100,
  "type": "BUY"
}
```

### JSON Response (400 Bad Request)
```json
{
  "success": false,
  "error": {
    "code": "INVALID_QUANTITY_OR_PRICE",
    "message": "quantity and price must be positive",
    "details": {
      "symbol": "RELIANCE-CE-2900",
      "quantity": 50,
      "price": -100,
      "type": "BUY"
    }
}
```

### UI Display Suggestion
```
❌ Invalid Input
Error Code: INVALID_QUANTITY_OR_PRICE
Message: Quantity and price must be positive numbers

Validation Rules:
✓ Quantity > 0
✓ Price > 0
✗ Your input: quantity=-50, price=-100
```

---

## Summary: Error Codes for UI Implementation

| Error Code | HTTP Status | Meaning | UI Action |
|-----------|------------|---------|-----------|
| `INSUFFICIENT_HOLDINGS` | 400 | Can't sell more than you own | Show max available shares |
| `INSUFFICIENT_CASH` | 400 | Can't buy without funds | Show cash needed vs available |
| `INVALID_QUANTITY_OR_PRICE` | 400 | Negative/zero values | Validate input fields |
| `INVALID_TRADE_TYPE` | 400 | Trade type not BUY/SELL | Show error |
| `INVALID_REQUEST_BODY` | 400 | JSON parsing error | Check request format |
| `METHOD_NOT_ALLOWED` | 405 | Wrong HTTP method | Check API docs |
| `UNAUTHORIZED` | 401 | Missing X-User-ID header | Login/authenticate |
| `WALLET_SNAPSHOT_ERROR` | 500 | Server error | Retry or contact support |
| `DEPOSIT_FAILED` | 400 | Deposit validation failed | Check amount > 0 |

---

## Frontend Integration Pattern

```typescript
// API call pattern for BUY/SELL
const result = await tradingRemoteDatasource.createTransaction({
  type: params.type === 'BUY' ? 'buy' : 'sell',
  symbol: params.symbol,
  quantity: params.quantity,
  price: params.price,
});

// Response handling
if (result.success) {
  // ✅ Success case: result contains data object
  // result.data.total, result.data.fee, result.data.quantity, etc.
  showSuccess(`${result.data.type} executed`);
} else {
  // ❌ Error case: result contains error object
  // result.error.code, result.error.message, result.error.details
  showError(result.error.code, result.error.message);
}
```

---

## Key Implementation Points

1. **All successful trades return**: `{ success: true, data: { ... } }`
2. **All failed trades return**: `{ success: false, error: { code, message, details } }`
3. **Always include error code** for UI to handle specific scenarios
4. **Fee is always 0.5%** calculated as: `total × 0.005`
5. **Validation must happen client-side** before API call (quantity > 0, price > 0)
6. **Error messages provide context** with actual vs requested amounts
