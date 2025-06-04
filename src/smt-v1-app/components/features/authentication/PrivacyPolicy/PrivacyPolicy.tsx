import React from 'react';
import asparelLogo from '../../../../../assets/img/icons/asparelLogo.jpg';

const PrivacyPolicy = () => {
  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-end align-items-center">
        <img
          src={asparelLogo}
          alt="Asparel Logo"
          className="mb-2"
          style={{ width: '275px', height: '100px' }}
        />
      </div>

      <div className="tab-content translations-content-item en visible" id="en">
        <h1 className="mb-3">Privacy Policy</h1>
        <p>
          <strong>Last Updated:</strong> January 6, 2025
        </p>

        <p>
          This Privacy Policy explains how{' '}
          <strong>ASPAREL Yazılım, Tasarım A.Ş.</strong> ("Company", "we",
          "our", or "us") collects, uses, discloses, and safeguards your
          personal data when you visit our website or use our services.
        </p>

        <p>
          By accessing or using our services, you acknowledge that you have read
          and understood this Privacy Policy and consent to the practices
          described herein.
        </p>

        <h2>1. Definitions</h2>
        <ul>
          <li>
            <strong>Personal Data:</strong> Any information that relates to an
            identified or identifiable individual (e.g., name, email, phone
            number).
          </li>
          <li>
            <strong>Usage Data:</strong> Data collected automatically when using
            our services (e.g., browser type, IP address, session duration).
          </li>
          <li>
            <strong>Cookies:</strong> Small files stored on your device to
            enhance user experience and analytics.
          </li>
          <li>
            <strong>Data Controller:</strong> The entity that determines the
            purpose and means of the processing of personal data.
          </li>
          <li>
            <strong>User:</strong> The individual using our services or
            accessing our website.
          </li>
        </ul>

        <h2>2. Data We Collect</h2>
        <ul>
          <li>Full name, email address, phone number</li>
          <li>Company name (if applicable)</li>
          <li>Billing and shipping address</li>
          <li>Device information (IP address, OS, browser)</li>
          <li>Usage behavior and browsing history</li>
          <li>Feedback, support requests, and communication records</li>
        </ul>

        <h2>3. How We Use Your Data</h2>
        <ul>
          <li>To deliver and manage our services</li>
          <li>To process transactions and send administrative information</li>
          <li>To respond to inquiries and provide customer support</li>
          <li>
            To send marketing and promotional content (if consent is given)
          </li>
          <li>
            To improve our services, analyze usage trends, and perform audits
          </li>
          <li>To comply with legal obligations and prevent fraud</li>
        </ul>

        <h2>4. Legal Basis for Processing</h2>
        <p>
          We process your personal data based on the following legal grounds
          (where applicable):
        </p>
        <ul>
          <li>Your consent</li>
          <li>Performance of a contract</li>
          <li>Legal obligations</li>
          <li>
            Legitimate interests, provided your rights do not override them
          </li>
        </ul>

        <h2>5. Cookies and Tracking Technologies</h2>
        <p>
          We use cookies and similar technologies to recognize you, remember
          your preferences, and analyze website performance. You can control
          cookies through your browser settings.
        </p>

        <h2>6. Sharing and Disclosure of Data</h2>
        <ul>
          <li>
            <strong>Service Providers:</strong> We may share your data with
            trusted partners who assist in operating our website or providing
            services.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your
            information where required by law or to protect legal rights.
          </li>
          <li>
            <strong>Business Transfers:</strong> In case of a merger,
            acquisition, or sale, your data may be transferred to the new
            entity.
          </li>
          <li>
            <strong>With Consent:</strong> We may disclose your data with your
            explicit consent for specific purposes.
          </li>
        </ul>

        <h2>7. Data Retention</h2>
        <p>
          We retain personal data only as long as necessary to fulfill the
          purposes outlined in this policy, unless a longer retention period is
          required or permitted by law.
        </p>

        <h2>8. Your Privacy Rights</h2>
        <p>You may exercise the following rights, subject to local law:</p>
        <ul>
          <li>Right to access the personal data we hold about you</li>
          <li>Right to correct or update your personal data</li>
          <li>Right to request deletion of your data</li>
          <li>Right to object to or restrict data processing</li>
          <li>Right to data portability</li>
          <li>
            Right to withdraw consent at any time (if processing is based on
            consent)
          </li>
        </ul>
        <p>
          You can make these requests by contacting us via the information in
          the "Contact Us" section below.
        </p>

        <h2>9. International Transfers</h2>
        <p>
          Your data may be transferred to and maintained on servers located
          outside your country. We ensure such transfers comply with applicable
          data protection laws and safeguard your privacy.
        </p>

        <h2>10. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to
          protect your data. However, no method of transmission over the
          internet is 100% secure.
        </p>

        <h2>11. Children’s Privacy</h2>
        <p>
          We do not knowingly collect data from individuals under the age of 13.
          If we learn we have collected such data without parental consent, we
          will take appropriate steps to delete it.
        </p>

        <h2>12. Third-Party Links</h2>
        <p>
          Our website may include links to external websites. We are not
          responsible for the content, privacy practices, or security of such
          websites. Please review their privacy policies before submitting any
          data.
        </p>

        <h2>13. Updates to This Policy</h2>
        <p>
          We may revise this Privacy Policy from time to time. Changes will be
          effective when posted. If significant changes are made, we will notify
          you via email or prominent notice on our website.
        </p>

        <h2>14. Contact Us</h2>
        <p>
          If you have any questions, requests, or concerns regarding this
          Privacy Policy, please contact us:
        </p>
        <ul>
          <li>
            <strong>Email:</strong> info@asparel.com.tr
          </li>
          {/* <li>
            <strong>Mailing Address:</strong> İzmir Teknopark Yerleşkesi A8
            Binası, Urla / İzmir, Turkey
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
