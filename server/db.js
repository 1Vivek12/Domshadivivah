import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(__dirname, 'data');
const dbFilePath = path.join(dataDir, 'db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initial seed data with correct role pricing and family members
const initialData = {
  memberships: [
    {
      id: 'MEM-2026-001',
      role: 'groom',
      fee: 5100,
      currency: 'INR',
      name: 'Raghavendra Singh Rathore',
      age: 29,
      dob: '1997-04-12',
      maritalStatus: 'never_married',
      education: 'M.Arch (SPA Delhi)',
      profession: 'Heritage Architect & Urban Preservationist',
      city: 'Udaipur',
      state: 'Rajasthan',
      phone: '+91 98290 12345',
      email: 'raghav.rathore@heritagearch.in',
      familyMembers: [
        { relation: 'Father', name: 'Thakur Vikram Singh Rathore', contact: '+91 98290 11111', consentGiven: true },
        { relation: 'Mother', name: 'Rani Devika Rathore', contact: '', consentGiven: true },
        { relation: 'Brother', name: 'Digvijay Singh Rathore', contact: '', consentGiven: true }
      ],
      termsAccepted: true,
      privacyConsent: true,
      status: 'active',
      marriageFixedConsent: false,
      charityVoluntaryNotified: false,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (No mock success)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      createdAt: '2026-03-10T10:00:00.000Z',
      updatedAt: '2026-03-10T10:00:00.000Z'
    },
    {
      id: 'MEM-2026-002',
      role: 'bride',
      fee: 2100,
      currency: 'INR',
      name: 'Ananya Sharma',
      age: 26,
      dob: '2000-08-21',
      maritalStatus: 'never_married',
      education: 'M.Tech (IISc Bengaluru)',
      profession: 'Principal AI Researcher & Classical Artist',
      city: 'Bengaluru',
      state: 'Karnataka',
      phone: '+91 98450 67890',
      email: 'ananya.sharma@researchlab.in',
      familyMembers: [
        { relation: 'Father', name: 'Dr. Ramakant Sharma', contact: '+91 98450 22222', consentGiven: true },
        { relation: 'Mother', name: 'Prof. Gayatri Sharma', contact: '', consentGiven: true },
        { relation: 'Sister', name: 'Sneha Sharma', contact: '', consentGiven: true }
      ],
      termsAccepted: true,
      privacyConsent: true,
      status: 'in_discussion',
      marriageFixedConsent: false,
      charityVoluntaryNotified: false,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (No mock success)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      createdAt: '2026-03-12T11:30:00.000Z',
      updatedAt: '2026-03-15T14:20:00.000Z'
    },
    {
      id: 'MEM-2026-003',
      role: 'bride',
      fee: 2100,
      currency: 'INR',
      name: 'Priyadarshini Rao',
      age: 27,
      dob: '1999-02-14',
      maritalStatus: 'never_married',
      education: 'PhD Scholar (AIIMS New Delhi)',
      profession: 'Biomedical Innovator & Bharatanatyam Exponent',
      city: 'Hyderabad',
      state: 'Telangana',
      phone: '+91 94400 54321',
      email: 'priya.rao@aiims.edu',
      familyMembers: [
        { relation: 'Father', name: 'Dr. K.V. Rao', contact: '+91 94400 11111', consentGiven: true },
        { relation: 'Mother', name: 'V. Shailaja Rao', contact: '', consentGiven: true }
      ],
      termsAccepted: true,
      privacyConsent: true,
      status: 'marriage_fixed',
      marriageFixedConfirmedBy: 'Admin (Parental Written Consent Verified)',
      marriageFixedConsent: true,
      charityVoluntaryNotified: true,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (No mock success)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      createdAt: '2026-02-01T09:15:00.000Z',
      updatedAt: '2026-03-20T16:00:00.000Z'
    },
    {
      id: 'MEM-2026-004',
      role: 'groom',
      fee: 5100,
      currency: 'INR',
      name: 'Devendra Pratap Singh',
      age: 30,
      dob: '1996-11-05',
      maritalStatus: 'never_married',
      education: 'B.Tech (IIT Kanpur), Public Policy (LBSNAA)',
      profession: 'Civil Services Officer & Rural Development Lead',
      city: 'Lucknow',
      state: 'Uttar Pradesh',
      phone: '+91 94150 98765',
      email: 'devendra.singh@ias.gov.in',
      familyMembers: [
        { relation: 'Father', name: 'Justice (Retd.) B.P. Singh', contact: '+91 94150 33333', consentGiven: true },
        { relation: 'Mother', name: 'Smt. Sharda Singh', contact: '', consentGiven: true }
      ],
      termsAccepted: true,
      privacyConsent: true,
      status: 'inactive',
      marriageFixedConsent: false,
      charityVoluntaryNotified: false,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (No mock success)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      createdAt: '2026-01-15T08:00:00.000Z',
      updatedAt: '2026-03-01T12:00:00.000Z'
    }
  ],
  charity_contributions: [
    {
      id: 'CHT-2026-001',
      contributorName: 'Suresh Chandra Agarwal & Family',
      email: 'sc.agarwal@trustphilanthropy.org',
      phone: '+91 98110 54321',
      amount: 11000,
      currency: 'INR',
      purpose: 'आर्थिक रूप से कमजोर परिवारों की बेटियों के विवाह में सहायता हेतु स्वैच्छिक योगदान',
      voluntaryAcknowledged: true,
      linkedMembershipId: null,
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (Awaiting Gateway Integration)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      disclaimerAccepted: true,
      createdAt: '2026-03-14T11:20:00.000Z'
    },
    {
      id: 'CHT-2026-002',
      contributorName: 'Rao Family (Post Marriage Fixed Gratitude)',
      email: 'family.rao@hyderabad.in',
      phone: '+91 94400 11111',
      amount: 5100,
      currency: 'INR',
      purpose: 'आर्थिक रूप से कमजोर परिवारों की बेटियों के विवाह में सहायता हेतु स्वैच्छिक योगदान',
      voluntaryAcknowledged: true,
      linkedMembershipId: 'MEM-2026-003',
      paymentStatus: 'gateway_pending',
      paymentGatewayStatus: 'INTEGRATION_PENDING (Awaiting Gateway Integration)',
      transactionRef: null,
      receiptRef: null,
      refundDisputeStatus: 'none',
      disclaimerAccepted: true,
      createdAt: '2026-03-21T09:45:00.000Z'
    }
  ],
  audit_logs: [
    {
      id: 'AUD-001',
      adminUser: 'superadmin@domshadivivah.in',
      action: 'STATUS_CHANGE',
      targetType: 'membership',
      targetId: 'MEM-2026-003',
      previousState: 'in_discussion',
      newState: 'marriage_fixed',
      reason: 'Verified both families written consent and wedding invitation card.',
      timestamp: '2026-03-20T16:00:00.000Z'
    },
    {
      id: 'AUD-002',
      adminUser: 'superadmin@domshadivivah.in',
      action: 'VOLUNTARY_CHARITY_NOTICE_SENT',
      targetType: 'charity_notice',
      targetId: 'MEM-2026-003',
      previousState: null,
      newState: 'sent_non_mandatory_notice',
      reason: 'Sent courteous congratulatory letter with explicit notice that charity is optional.',
      timestamp: '2026-03-20T16:05:00.000Z'
    }
  ],
  grievances: [
    {
      id: 'GRV-2026-001',
      name: 'Sunita Mishra',
      phone: '+91 98390 44444',
      email: 'sunita.mishra@lucknow.in',
      subject: 'Inquiry regarding family elder mediation protocol',
      description: 'Requesting confirmation on whether paternal or maternal family elder representative can attend introductory meeting.',
      status: 'resolved',
      createdAt: '2026-03-18T14:10:00.000Z'
    }
  ]
};

class Database {
  constructor() {
    this.data = initialData;
    this.load();
  }

  load() {
    try {
      if (fs.existsSync(dbFilePath)) {
        const raw = fs.readFileSync(dbFilePath, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.save();
      }
    } catch (err) {
      console.error('Error loading db file, using memory seed:', err);
      this.data = initialData;
    }
  }

  save() {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving db file:', err);
    }
  }

  getMemberships(includePrivate = false) {
    if (includePrivate) {
      return this.data.memberships;
    }
    // Public sanitized version: strip out direct phone, email, fee, payment status, and private family contact numbers
    return this.data.memberships.map((m) => {
      const {
        phone,
        email,
        fee,
        paymentStatus,
        paymentGatewayStatus,
        transactionRef,
        receiptRef,
        refundDisputeStatus,
        ...sanitized
      } = m;
      const sanitizedFamily = (m.familyMembers || []).map(({ relation, name, consentGiven }) => ({
        relation,
        name,
        consentGiven,
      }));
      return {
        ...sanitized,
        familyMembers: sanitizedFamily,
      };
    });
  }

  getMembershipById(id) {
    return this.data.memberships.find((m) => m.id === id);
  }

  addMembership(entry) {
    this.data.memberships.unshift(entry);
    this.save();
    return entry;
  }

  updateMembershipStatus(id, newStatus, reason, adminUser) {
    const member = this.data.memberships.find((m) => m.id === id);
    if (!member) return null;

    const previousState = member.status;
    member.status = newStatus;
    member.updatedAt = new Date().toISOString();

    if (newStatus === 'marriage_fixed') {
      member.marriageFixedConsent = true;
      member.marriageFixedConfirmedBy = adminUser || 'Admin Verification';
      // Mark charity voluntary notice as ready/sent, WITHOUT auto payment
      member.charityVoluntaryNotified = true;
    }

    // Record in audit log
    this.addAuditLog({
      adminUser: adminUser || 'admin@domshadivivah.in',
      action: 'STATUS_CHANGE',
      targetType: 'membership',
      targetId: id,
      previousState,
      newState: newStatus,
      reason: reason || 'Status updated by administrator',
    });

    this.save();
    return member;
  }

  getCharityContributions() {
    return this.data.charity_contributions;
  }

  addCharityContribution(entry) {
    this.data.charity_contributions.unshift(entry);
    this.save();
    return entry;
  }

  getAuditLogs() {
    return this.data.audit_logs;
  }

  addAuditLog(entry) {
    const log = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    this.data.audit_logs.unshift(log);
    this.save();
    return log;
  }

  getGrievances() {
    return this.data.grievances;
  }

  addGrievance(entry) {
    this.data.grievances.unshift(entry);
    this.save();
    return entry;
  }
}

export const db = new Database();
