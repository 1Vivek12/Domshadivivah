import express from 'express';
import cors from 'cors';
import { db } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ADMIN AUTH CONSTANTS
const ADMIN_EMAIL = 'admin@domshadivivah.in';
const ADMIN_PASS = 'RoyalAdmin2026!#';
const ADMIN_TOKEN = 'DOM_ROYAL_ADMIN_SECURE_TOKEN_2026';

// Middleware for server-side permission check
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Admin authentication token required',
    });
  }

  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid or expired admin token',
    });
  }

  req.adminUser = ADMIN_EMAIL;
  next();
}

// -------------------------------------------------------------
// 1. PUBLIC ENDPOINTS
// -------------------------------------------------------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    project: 'Dom Shadi Vivah',
    version: '2.0.0-phase2',
    timestamp: new Date().toISOString(),
  });
});

// Public sanitized profiles (No phone, email, or private contact info)
app.get('/api/membership/public', (req, res) => {
  try {
    const profiles = db.getMemberships(false);
    res.json({ success: true, data: profiles });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to retrieve public profiles' });
  }
});

// Register new membership
app.post('/api/membership/register', (req, res) => {
  try {
    const {
      role,
      name,
      dob,
      age,
      maritalStatus,
      education,
      profession,
      city,
      state,
      phone,
      email,
      familyMembers,
      termsAccepted,
      privacyConsent,
    } = req.body;

    const candidateName = (req.body.name || req.body.fullName || '').trim();

    // Server-side validation
    if (!role || !['groom', 'bride'].includes(role)) {
      return res.status(400).json({ success: false, error: 'Invalid role. Must be groom or bride.' });
    }
    if (!candidateName || candidateName.length < 2) {
      return res.status(400).json({ success: false, error: 'Name must be at least 2 characters long.' });
    }
    if (!phone || phone.trim().length < 8) {
      return res.status(400).json({ success: false, error: 'A valid contact phone number is required.' });
    }
    if (!termsAccepted || !privacyConsent) {
      return res.status(400).json({
        success: false,
        error: 'You must accept the terms of service and consent to confidential data processing.',
      });
    }

    // STRICT SERVER-SIDE FEE ENFORCEMENT (Requirement 1: Groom ₹5,100, Bride ₹2,100)
    const fee = role === 'groom' ? 5100 : 2100;

    // Clean family members array (Requirement 3: "Family Members" / "परिवार के सदस्य")
    const cleanFamily = Array.isArray(familyMembers)
      ? familyMembers.map((m) => ({
          relation: m.relation || 'Guardian',
          name: m.name ? m.name.trim() : '',
          contact: m.contact ? m.contact.trim() : '',
          consentGiven: Boolean(m.consentGiven),
        }))
      : [];

    const newMember = {
      id: `MEM-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      role,
      fee,
      currency: 'INR',
      name: candidateName,
      dob: dob || '',
      age: Number(age) || 25,
      maritalStatus: maritalStatus || 'never_married',
      education: education ? education.trim() : '',
      profession: profession ? profession.trim() : '',
      city: city ? city.trim() : '',
      state: state ? state.trim() : '',
      phone: phone.trim(),
      email: email ? email.trim() : '',
      familyMembers: cleanFamily,
      termsAccepted: true,
      privacyConsent: true,
      status: 'active',
      marriageFixedConsent: false,
      charityVoluntaryNotified: false,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (No mock success screen)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.addMembership(newMember);

    // Audit log
    db.addAuditLog({
      adminUser: 'SYSTEM_REGISTRATION',
      action: 'NEW_MEMBERSHIP_REGISTERED',
      targetType: 'membership',
      targetId: newMember.id,
      previousState: null,
      newState: 'active',
      reason: `Member registered as ${role.toUpperCase()} with fee ₹${fee}. Payment pending gateway integration.`,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newMember.id,
        name: newMember.name,
        role: newMember.role,
        fee: newMember.fee,
        currency: 'INR',
        paymentStatus: 'gateway_pending',
        gatewayStatus: 'INTEGRATION_PENDING',
        messageHindi: `पंजीकरण दर्ज हुआ। ${role === 'groom' ? 'वर' : 'वधू'} सदस्यता शुल्क ₹${fee.toLocaleString()} है। भुगतान गेटवे अभी एकीकरण (Integration) प्रक्रिया में है। वास्तविक सत्यापन के बिना कोई लेनदेन सफल नहीं माना जाएगा।`,
        messageEn: `Registration recorded. ${role === 'groom' ? 'Groom' : 'Bride'} membership fee is ₹${fee.toLocaleString()}. Payment gateway integration is currently in progress. No transaction is marked as successful without genuine verification.`,
      },
    });
  } catch (err) {
    console.error('Membership registration error:', err);
    res.status(500).json({ success: false, error: 'Internal server error processing registration' });
  }
});

// Contribute voluntary charity (Requirement 5 & 6)
app.post('/api/charity/contribute', (req, res) => {
  try {
    const { contributorName, email, phone, amount, linkedMembershipId, disclaimerAccepted } = req.body;

    if (!contributorName || contributorName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Contributor name is required.' });
    }
    const numAmount = Number(amount);
    if (isNaN(numAmount) || numAmount < 100) {
      return res.status(400).json({ success: false, error: 'Charity contribution amount must be at least ₹100.' });
    }
    if (!disclaimerAccepted) {
      return res.status(400).json({
        success: false,
        error: 'Please acknowledge that this charity contribution is completely voluntary and separate from membership fees.',
      });
    }

    const newCharity = {
      id: `CHT-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`,
      contributorName: contributorName.trim(),
      email: email ? email.trim() : '',
      phone: phone ? phone.trim() : '',
      amount: numAmount,
      currency: 'INR',
      purpose: 'आर्थिक रूप से कमजोर परिवारों की बेटियों के विवाह में सहायता हेतु स्वैच्छिक योगदान',
      voluntaryAcknowledged: true,
      linkedMembershipId: linkedMembershipId || null,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (Awaiting Gateway Integration)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      disclaimerAccepted: true,
      createdAt: new Date().toISOString(),
    };

    db.addCharityContribution(newCharity);

    db.addAuditLog({
      adminUser: 'SYSTEM_CHARITY',
      action: 'CHARITY_CONTRIBUTION_PLEDGED',
      targetType: 'charity',
      targetId: newCharity.id,
      previousState: null,
      newState: 'pledged_gateway_pending',
      reason: `Voluntary charity pledge of ₹${numAmount} recorded separately. Gateway integration pending.`,
    });

    res.status(201).json({
      success: true,
      data: {
        id: newCharity.id,
        amount: numAmount,
        currency: 'INR',
        paymentStatus: 'gateway_pending',
        gatewayStatus: 'INTEGRATION_PENDING',
        messageHindi: `कल्याणम् सेवा सहयोग संकल्प दर्ज हुआ (राशि: ₹${numAmount.toLocaleString()})। यह सदस्यता शुल्क से पूर्णतः अलग है। भुगतान गेटवे एकीकरण प्रक्रिया में है।`,
        messageEn: `Voluntary Kalyanam charity contribution recorded (Amount: ₹${numAmount.toLocaleString()}). This is strictly separate from membership revenue. Gateway integration is pending.`,
      },
    });
  } catch (err) {
    console.error('Charity contribution error:', err);
    res.status(500).json({ success: false, error: 'Internal server error processing charity contribution' });
  }
});

// Submit user grievance / inquiry
app.post('/api/grievances', (req, res) => {
  try {
    const { name, phone, email, subject, description } = req.body;
    if (!name || !description) {
      return res.status(400).json({ success: false, error: 'Name and description are required.' });
    }

    const grievance = {
      id: `GRV-${Date.now().toString().slice(-5)}`,
      name: name.trim(),
      phone: phone ? phone.trim() : '',
      email: email ? email.trim() : '',
      subject: subject ? subject.trim() : 'General Inquiry',
      description: description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    db.addGrievance(grievance);
    res.status(201).json({ success: true, data: grievance });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to record grievance' });
  }
});

// -------------------------------------------------------------
// 2. ADMIN AUTHENTICATION & MANAGEMENT (Protected)
// -------------------------------------------------------------

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    return res.json({
      success: true,
      token: ADMIN_TOKEN,
      user: {
        email: ADMIN_EMAIL,
        role: 'SUPER_ADMIN',
        name: 'Dom Shadi Vivah Secretariat Admin',
      },
    });
  }
  return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
});

// Admin verify token
app.get('/api/admin/me', requireAdminAuth, (req, res) => {
  res.json({
    success: true,
    user: {
      email: req.adminUser,
      role: 'SUPER_ADMIN',
    },
  });
});

// Get all membership records (Full private details for authorized admins only)
app.get('/api/admin/memberships', requireAdminAuth, (req, res) => {
  try {
    const all = db.getMemberships(true);
    res.json({ success: true, data: all });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch membership records' });
  }
});

// Update membership status (Requirement 4: Active, In Discussion, Marriage Fixed, Inactive)
app.patch('/api/admin/memberships/:id/status', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { status, reason, marriageFixedConsentConfirmed } = req.body;

    const validStatuses = ['active', 'in_discussion', 'marriage_fixed', 'inactive'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    // Requirement 4: "विवाह तय हुआ" की स्थिति बदलने से पहले उचित पुष्टि और अनुमति आवश्यक हो
    if (status === 'marriage_fixed' && !marriageFixedConsentConfirmed) {
      return res.status(400).json({
        success: false,
        error: 'Confirmation required: Written consent from both parties must be verified before marking Marriage Fixed.',
      });
    }

    const updated = db.updateMembershipStatus(id, status, reason, req.adminUser);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Member not found' });
    }

    res.json({
      success: true,
      data: updated,
      message: `Status updated to ${status}. ${status === 'marriage_fixed' ? 'Note: No charity payment was triggered automatically. A voluntary courtesy notice may be sent separately.' : ''}`,
    });
  } catch (err) {
    console.error('Update status error:', err);
    res.status(500).json({ success: false, error: 'Failed to update membership status' });
  }
});

// Get separate charity ledger (Requirement 6)
app.get('/api/admin/charity', requireAdminAuth, (req, res) => {
  try {
    const allCharity = db.getCharityContributions();
    res.json({ success: true, data: allCharity });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch charity ledger' });
  }
});

// Get audit logs (Requirement 6 & 7)
app.get('/api/admin/audit-logs', requireAdminAuth, (req, res) => {
  try {
    const logs = db.getAuditLogs();
    res.json({ success: true, data: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch audit logs' });
  }
});

// Get grievances (Requirement 7)
app.get('/api/admin/grievances', requireAdminAuth, (req, res) => {
  try {
    const list = db.getGrievances();
    res.json({ success: true, data: list });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to fetch grievances' });
  }
});

// Export records based on authorized permissions (Requirement 7)
app.get('/api/admin/export/:type', requireAdminAuth, (req, res) => {
  try {
    const { type } = req.params;
    let data = [];
    if (type === 'memberships') {
      data = db.getMemberships(true);
    } else if (type === 'charity') {
      data = db.getCharityContributions();
    } else if (type === 'audit') {
      data = db.getAuditLogs();
    } else {
      return res.status(400).json({ success: false, error: 'Invalid export type' });
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=domshadivivah_${type}_${Date.now()}.json`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: 'Export failed' });
  }
});

app.listen(PORT, () => {
  console.log(`DOM SHADI VIVAH Backend API Server listening on port ${PORT}`);
});
