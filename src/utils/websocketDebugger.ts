/**
 * WebSocket Connection Debugger
 * Tests token availability and WebSocket connection
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const debugWebSocket = async () => {
  console.log('\n========== 🔍 WEBSOCKET DEBUG START ==========');
  
  try {
    // Step 1: Check token
    console.log('\n1️⃣ Checking auth token...');
    const token = await AsyncStorage.getItem('auth_token');
    
    if (!token) {
      console.error('❌ NO TOKEN FOUND in AsyncStorage!');
      console.log('Available keys in AsyncStorage:', await AsyncStorage.getAllKeys());
      return false;
    }
    
    console.log('✅ Token found');
    console.log('   Length:', token.length);
    console.log('   Starts with:', token.substring(0, 20) + '...');
    console.log('   Ends with:', '...' + token.substring(token.length - 20));
    
    // Step 2: Construct WebSocket URL
    console.log('\n2️⃣ Constructing WebSocket URL...');
    const wsUrl = `wss://divider-backend.onrender.com/ws?token=${token}`;
    console.log('   URL (first 60 chars):', wsUrl.substring(0, 60) + '...');
    
    // Step 3: Test WebSocket connection
    console.log('\n3️⃣ Testing WebSocket connection...');
    console.log('   Attempting to connect...');
    
    return new Promise((resolve) => {
      const testWs = new WebSocket(wsUrl);
      let timedOut = false;
      
      const timeoutId = setTimeout(() => {
        timedOut = true;
        console.error('❌ WebSocket connection timeout (10 seconds)');
        testWs.close();
        resolve(false);
      }, 10000);
      
      testWs.onopen = () => {
        if (timedOut) return;
        clearTimeout(timeoutId);
        console.log('✅ WebSocket connection SUCCESSFUL!');
        
        // Wait for first message
        console.log('\n4️⃣ Waiting for first message (5 seconds)...');
        let messageReceived = false;
        
        const messageTimeoutId = setTimeout(() => {
          if (!messageReceived) {
            console.error('❌ No message received after 5 seconds');
          }
          testWs.close();
          resolve(true);
        }, 5000);
        
        testWs.onmessage = (event) => {
          clearTimeout(messageTimeoutId);
          messageReceived = true;
          console.log('📨 First message received!');
          console.log('   Size:', event.data.length, 'bytes');
          console.log('   Content:', event.data.substring(0, 200));
          
          try {
            const data = JSON.parse(event.data);
            console.log('   Parsed successfully ✅');
            console.log('   Type:', Array.isArray(data) ? 'Array' : typeof data);
            if (Array.isArray(data)) {
              console.log('   Items:', data.length);
              if (data.length > 0) {
                console.log('   First item:', JSON.stringify(data[0]));
              }
            }
          } catch (e) {
            console.error('   Parse error:', e);
          }
          
          testWs.close();
          resolve(true);
        };
        
        testWs.onerror = (err) => {
          clearTimeout(messageTimeoutId);
          console.error('❌ Message error:', err);
          resolve(true);
        };
      };
      
      testWs.onerror = (event) => {
        if (timedOut) return;
        clearTimeout(timeoutId);
        console.error('❌ WebSocket connection failed!');
        console.error('   Error:', event);
        resolve(false);
      };
      
      testWs.onclose = () => {
        console.log('⚠️ WebSocket closed');
      };
    });
    
  } catch (err) {
    console.error('❌ Debug error:', err);
    return false;
  } finally {
    console.log('\n========== 🔍 WEBSOCKET DEBUG END ==========\n');
  }
};
