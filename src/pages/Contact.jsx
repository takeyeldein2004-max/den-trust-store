import { FaWhatsapp, FaInstagram, FaFacebookMessenger, FaPhoneAlt, FaMapMarkerAlt, FaEnvelope } from "react-icons/fa";

// ⬇️ REPLACE THESE WITH YOUR REAL LINKS ⬇️
const contactInfo = {
  whatsapp: "https://wa.me/+201157004081",          
  instagram: "https://www.instagram.com/_dentrust_?igsh=dm91YTk2aW55Z295",    
  messenger: "https://www.facebook.com/share/17Lc9itsS3/",              
  phone: "tel:+201153788802",                                           
  address: "egypt,alexanderia,elagamy,starmall",                
};

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">

        {/* Header */}
        <h1 className="text-4xl font-bold text-den-navy mb-4">
          Get In Touch
        </h1>
        <p className="text-gray-600 text-lg mb-12">
          Contact us through any of these channels. We respond quickly!
        </p>

        {/* Contact Buttons */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">

          {/* WhatsApp Button */}
          <a
            href={contactInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-4 bg-green-500 text-white p-6 rounded-xl shadow-lg hover:bg-green-600 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <FaWhatsapp className="text-4xl" />
            <div className="text-left">
              <p className="text-xl font-bold">WhatsApp</p>
              <p className="text-sm opacity-80">Chat with us directly</p>
            </div>
          </a>

          {/* Instagram Button */}
          <a
            href={contactInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <FaInstagram className="text-4xl" />
            <div className="text-left">
              <p className="text-xl font-bold">Instagram</p>
              <p className="text-sm opacity-80">Follow us for updates</p>
            </div>
          </a>

          {/* Messenger Button */}
          <a
            href={contactInfo.messenger}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-4 bg-blue-600 text-white p-6 rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <FaFacebookMessenger className="text-4xl" />
            <div className="text-left">
              <p className="text-xl font-bold">Messenger</p>
              <p className="text-sm opacity-80">Message us on Facebook</p>
            </div>
          </a>

          {/* Phone Button */}
          <a
            href={contactInfo.phone}
            className="flex items-center justify-center space-x-4 bg-den-navy text-white p-6 rounded-xl shadow-lg hover:bg-den-red hover:shadow-xl transition transform hover:-translate-y-1"
          >
            <FaPhoneAlt className="text-4xl" />
            <div className="text-left">
              <p className="text-xl font-bold">Call Us</p>
              <p className="text-sm opacity-80">Speak with our team</p>
            </div>
          </a>

        </div>

        {/* Extra Info */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <h2 className="text-2xl font-bold text-den-navy mb-6">
            Other Ways To Reach Us
          </h2>

          <div className="space-y-4">


            <div className="flex items-center justify-center space-x-3 text-gray-600">
              <FaMapMarkerAlt className="text-den-red text-xl" />
              <span className="text-lg">{contactInfo.address}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Contact;