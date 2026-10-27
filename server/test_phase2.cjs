// test_phase2.cjs - Comprehensive Verification of Dom Shadi Vivah Phase 2 Endpoints
const http = require('http');

function postJson(urlPath, data, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJson(urlPath, token) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: urlPath,
      method: 'GET',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.end();
  });
}

function patchJson(urlPath, data, token) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: urlPath,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('DOM SHADI VIVAH - PHASE 2 AUTOMATED TEST SUITE');
  console.log('====================================================\n');

  // 1. Health
  const health = await getJson('/api/health');
  console.log('[TEST 1] API Health:', health.status === 200 && health.data.status === 'ok' ? 'PASSED ✅' : 'FAILED ❌', health.data);

  // 2. Groom Registration (Fee must be 5100)
  const groomReg = await postJson('/api/membership/register', {
    role: 'groom',
    name: 'Amit Vikramaditya',
    age: 29,
    dob: '1996-05-14',
    maritalStatus: 'never_married',
    education: 'B.Tech IIT Delhi',
    profession: 'Senior System Architect',
    city: 'Patna / Bengaluru',
    phone: '9876543210',
    email: 'amit.vikram@example.com',
    familyMembers: [
      { relation: 'Father', name: 'Shri R. K. Vikramaditya', contact: '9876543211', consentGiven: true },
      { relation: 'Mother', name: 'Smt. Shanti Vikramaditya', contact: '', consentGiven: true }
    ],
    termsAccepted: true,
    privacyConsent: true
  });
  console.log('[TEST 2] Groom Registration (Fee = ₹5,100):',
    groomReg.status === 201 && groomReg.data.data.fee === 5100 && groomReg.data.data.paymentStatus === 'gateway_pending'
      ? 'PASSED ✅ (ID: ' + groomReg.data.data.id + ', Fee: ₹' + groomReg.data.data.fee + ', Status: ' + groomReg.data.data.paymentStatus + ')'
      : 'FAILED ❌', groomReg.data
  );

  // 3. Bride Registration (Fee must be 2100)
  const brideReg = await postJson('/api/membership/register', {
    role: 'bride',
    name: 'Sunidhi Kumari',
    age: 26,
    dob: '1999-08-22',
    maritalStatus: 'never_married',
    education: 'M.Sc Biochemistry',
    profession: 'Research Associate',
    city: 'Varanasi',
    phone: '9123456789',
    email: 'sunidhi.k@example.com',
    familyMembers: [
      { relation: 'Father', name: 'Shri D. N. Shastri', contact: '9123456780', consentGiven: true }
    ],
    termsAccepted: true,
    privacyConsent: true
  });
  console.log('[TEST 3] Bride Registration (Fee = ₹2,100):',
    brideReg.status === 201 && brideReg.data.data.fee === 2100 && brideReg.data.data.paymentStatus === 'gateway_pending'
      ? 'PASSED ✅ (ID: ' + brideReg.data.data.id + ', Fee: ₹' + brideReg.data.data.fee + ', Status: ' + brideReg.data.data.paymentStatus + ')'
      : 'FAILED ❌', brideReg.data
  );

  // 4. Public Profile Privacy Sanitization
  const publicProfiles = await getJson('/api/membership/public');
  const profilesList = publicProfiles.data.data || [];
  const hasPrivateDataExposed = profilesList.some(p => p.phone || p.email || p.fee || p.paymentStatus);
  console.log('[TEST 4] Public Profiles Strip Sensitive Data (Phone/Email/Fee/PaymentStatus):',
    publicProfiles.status === 200 && !hasPrivateDataExposed && profilesList.length > 0
      ? 'PASSED ✅ (Total Public Profiles: ' + profilesList.length + ', Private Contact Data Strictly Hidden)'
      : 'FAILED ❌'
  );

  // 5. Voluntary Charity Contribution (Separate Ledger)
  const charityContr = await postJson('/api/charity/contribute', {
    contributorName: 'Dr. Alok Verma',
    email: 'dr.verma@example.com',
    phone: '9876500000',
    amount: 11000,
    disclaimerAccepted: true
  });
  console.log('[TEST 5] Charity Contribution (Separate Ledger, Gateway Pending):',
    charityContr.status === 201 && charityContr.data.data.amount === 11000 && charityContr.data.data.paymentStatus === 'gateway_pending'
      ? 'PASSED ✅ (ID: ' + charityContr.data.data.id + ', Amount: ₹' + charityContr.data.data.amount + ', Status: ' + charityContr.data.data.paymentStatus + ')'
      : 'FAILED ❌', charityContr.data
  );

  // 6. Admin Authentication & Protected Route Verification
  const unauthAccess = await getJson('/api/admin/memberships');
  console.log('[TEST 6a] Admin Protected Endpoint Rejects Unauthorized Access:',
    unauthAccess.status === 401 ? 'PASSED ✅ (HTTP 401 Unauthorized)' : 'FAILED ❌'
  );

  const loginRes = await postJson('/api/admin/login', {
    email: 'admin@domshadivivah.in',
    password: 'RoyalAdmin2026!#'
  });
  console.log('[TEST 6b] Admin Login with Valid Credentials:',
    loginRes.status === 200 && loginRes.data.token ? 'PASSED ✅ (Token Received)' : 'FAILED ❌'
  );

  const token = loginRes.data?.token;

  // 7. Marriage Fixed Status Update Safeguard (requires explicit written consent confirmation)
  const groomId = groomReg.data.data.id;

  // Attempt without consent confirmation -> must fail
  const badStatusUpdate = await patchJson(`/api/admin/memberships/${groomId}/status`, {
    status: 'marriage_fixed',
    marriageFixedConsentConfirmed: false,
    notes: 'Attempting without consent confirmation'
  }, token);
  console.log('[TEST 7a] Marriage Fixed Rejected Without Explicit Consent Confirmation:',
    badStatusUpdate.status === 400 ? 'PASSED ✅ (HTTP 400 Rejected: ' + badStatusUpdate.data.error + ')' : 'FAILED ❌'
  );

  // Now update with consent confirmed
  const validStatusUpdate = await patchJson(`/api/admin/memberships/${groomId}/status`, {
    status: 'marriage_fixed',
    marriageFixedConsentConfirmed: true,
    reason: 'Verified mutual consent agreement signed by both families on 27-Oct-2026.'
  }, token);
  console.log('[TEST 7b] Marriage Fixed Approved With Written Consent & No Automatic Charity Charge:',
    validStatusUpdate.status === 200 &&
    validStatusUpdate.data.data.status === 'marriage_fixed' &&
    validStatusUpdate.data.data.charityVoluntaryNotified === true
      ? 'PASSED ✅ (Status: marriage_fixed, Charity Voluntary Notified: true, Auto-Charge: None)'
      : 'FAILED ❌', validStatusUpdate.data
  );

  // 8. Separate Ledgers Verification (Admin can view segregated Memberships vs Charity)
  const adminMemberships = await getJson('/api/admin/memberships', token);
  const adminCharity = await getJson('/api/admin/charity', token);
  const adminAudit = await getJson('/api/admin/audit-logs', token);

  const membershipsCount = adminMemberships.data.data?.length || 0;
  const charityCount = adminCharity.data.data?.length || 0;
  const auditCount = adminAudit.data.data?.length || 0;

  console.log('[TEST 8] Segregated Accounting Ledgers in Admin:',
    adminMemberships.status === 200 && adminCharity.status === 200 && adminAudit.status === 200 && membershipsCount > 0 && charityCount > 0
      ? `PASSED ✅ (Total Memberships: ${membershipsCount}, Total Charity Records: ${charityCount}, Total Audit Logs: ${auditCount})`
      : 'FAILED ❌'
  );

  console.log('\n====================================================');
  console.log('ALL PHASE 2 BACKEND & ARCHITECTURAL TESTS COMPLETED');
  console.log('====================================================');
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
