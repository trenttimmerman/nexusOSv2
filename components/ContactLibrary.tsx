
import React from 'react';
import { EditableText } from './HeroLibrary';
import { Send, MapPin, Phone, Mail, Clock, MessageSquare, HelpCircle, Twitter, Instagram, Facebook, Linkedin, ArrowRight } from 'lucide-react';

export const CONTACT_OPTIONS = [
  { id: 'contact-simple', name: 'Simple Form', description: 'Centered contact form' },
  { id: 'contact-split', name: 'Split with Info', description: 'Form and contact details side-by-side' },
  { id: 'contact-map', name: 'Map & Form', description: 'Location map with contact form' },
  { id: 'contact-minimal', name: 'Minimal Text', description: 'Large typography contact details' },
  { id: 'contact-floating', name: 'Floating Card', description: 'Contact card floating over image' },
  { id: 'contact-grid', name: 'Support Grid', description: 'Grid of support options' },
  { id: 'contact-newsletter', name: 'Newsletter Focus', description: 'Prominent newsletter signup' },
  { id: 'contact-faq', name: 'FAQ & Contact', description: 'Frequently asked questions with form' },
  { id: 'contact-social', name: 'Social Connect', description: 'Social media focused layout' },
  { id: 'contact-office', name: 'Office Locations', description: 'Multiple office locations grid' },
];

export const CONTACT_COMPONENTS: Record<string, React.FC<any>> = {
  'contact-simple': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-2xl mx-auto">
      <div className="text-center mb-12">
        <EditableText
          value={data?.heading || 'Get in Touch'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-3xl font-bold mb-4"
        />
        <EditableText
          value={data?.subheading || 'We would love to hear from you.'}
          onChange={(val) => onUpdate?.({ ...data, subheading: val })}
          isEditable={isEditable}
          className="text-gray-600"
        />
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
          <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
        </div>
        <textarea placeholder="Message" rows={4} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"></textarea>
        <button className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
          Send Message <Send size={16} />
        </button>
      </form>
    </div>
  ),

  'contact-split': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <div>
          <EditableText
            value={data?.heading || 'Contact Us'}
            onChange={(val) => onUpdate?.({ ...data, heading: val })}
            isEditable={isEditable}
            className="text-4xl font-bold mb-6"
          />
          <div className="space-y-8 mt-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <MapPin size={20} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Visit Us</h4>
                <p className="text-gray-600">123 Commerce St, Suite 100<br/>New York, NY 10012</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Mail size={20} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Email Us</h4>
                <p className="text-gray-600">hello@nexusos.com<br/>support@nexusos.com</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <Phone size={20} />
              </div>
              <div>
                <h4 className="font-bold mb-1">Call Us</h4>
                <p className="text-gray-600">+1 (555) 123-4567<br/>Mon-Fri, 9am-6pm EST</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-8 rounded-2xl">
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
            <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
            <input type="tel" placeholder="Phone" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
            <textarea placeholder="How can we help?" rows={4} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none"></textarea>
            <button className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  ),

  'contact-map': ({ data, isEditable, onUpdate }) => (
    <div className="relative h-[600px] bg-gray-200">
      <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,12,0/1000x600?access_token=YOUR_TOKEN')] bg-cover bg-center opacity-50 grayscale"></div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full mx-4 pointer-events-auto">
          <h3 className="text-2xl font-bold mb-4">Find Us</h3>
          <p className="text-gray-600 mb-6">We are located in the heart of the city. Come say hello!</p>
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3 text-sm">
              <MapPin size={16} className="text-gray-400" />
              <span>123 Broadway, New York, NY</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock size={16} className="text-gray-400" />
              <span>Open Daily: 10am - 8pm</span>
            </div>
          </div>
          <button className="w-full py-3 bg-black text-white font-bold rounded-lg">Get Directions</button>
        </div>
      </div>
    </div>
  ),

  'contact-minimal': ({ data, isEditable, onUpdate }) => (
    <div className="py-32 px-6 max-w-5xl mx-auto text-center">
      <EditableText
        value={data?.heading || 'Let\'s Talk'}
        onChange={(val) => onUpdate?.({ ...data, heading: val })}
        isEditable={isEditable}
        className="text-6xl md:text-8xl font-black tracking-tighter mb-12"
      />
      <div className="grid md:grid-cols-2 gap-12 text-left max-w-3xl mx-auto">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">General Inquiries</h4>
          <a href="mailto:hello@nexus.com" className="text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors">hello@nexus.com</a>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Support</h4>
          <a href="mailto:help@nexus.com" className="text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors">help@nexus.com</a>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Press</h4>
          <a href="mailto:press@nexus.com" className="text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors">press@nexus.com</a>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">Careers</h4>
          <a href="mailto:jobs@nexus.com" className="text-2xl md:text-3xl font-bold hover:text-blue-600 transition-colors">jobs@nexus.com</a>
        </div>
      </div>
    </div>
  ),

  'contact-floating': ({ data, isEditable, onUpdate }) => (
    <div className="relative py-32 px-6 bg-gray-900">
      <div className="absolute inset-0 opacity-30">
        <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80" className="w-full h-full object-cover" alt="Office" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto flex justify-end">
        <div className="bg-white p-10 rounded-3xl shadow-2xl max-w-lg w-full">
          <h3 className="text-3xl font-bold mb-2">Send a Message</h3>
          <p className="text-gray-600 mb-8">We typically reply within 24 hours.</p>
          <form className="space-y-4">
            <input type="text" placeholder="Your Name" className="w-full p-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black" />
            <input type="email" placeholder="Your Email" className="w-full p-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black" />
            <textarea placeholder="Message" rows={4} className="w-full p-4 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-black"></textarea>
            <button className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">Send Now</button>
          </form>
        </div>
      </div>
    </div>
  ),

  'contact-grid': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <EditableText
          value={data?.heading || 'How can we help?'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl font-bold"
        />
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: MessageSquare, title: 'Chat Support', desc: 'Live chat with our team', action: 'Start Chat' },
          { icon: Mail, title: 'Email Us', desc: 'Send us a detailed message', action: 'Send Email' },
          { icon: HelpCircle, title: 'Help Center', desc: 'Browse our knowledge base', action: 'Visit Help Center' }
        ].map((item, i) => (
          <div key={i} className="bg-gray-50 p-8 rounded-2xl text-center hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <item.icon size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">{item.title}</h3>
            <p className="text-gray-600 mb-6">{item.desc}</p>
            <button className="text-blue-600 font-bold flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all">
              {item.action} <ArrowRight size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  ),

  'contact-newsletter': ({ data, isEditable, onUpdate }) => (
    <div className="py-24 px-6 bg-blue-600 text-white text-center">
      <div className="max-w-3xl mx-auto">
        <Mail size={48} className="mx-auto mb-6 opacity-80" />
        <EditableText
          value={data?.heading || 'Join the Club'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl md:text-6xl font-bold mb-6"
        />
        <p className="text-xl text-blue-100 mb-10">Subscribe to receive updates, access to exclusive deals, and more.</p>
        <div className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto">
          <input type="email" placeholder="Enter your email address" className="flex-1 p-4 rounded-full text-black outline-none focus:ring-4 focus:ring-blue-400" />
          <button className="px-8 py-4 bg-black text-white font-bold rounded-full hover:bg-gray-900 transition-colors">Subscribe</button>
        </div>
        <p className="text-sm text-blue-200 mt-6">No spam, unsubscribe anytime.</p>
      </div>
    </div>
  ),

  'contact-faq': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-16">
        <div>
          <h3 className="text-3xl font-bold mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-b pb-6">
                <h4 className="font-bold text-lg mb-2">How do I track my order?</h4>
                <p className="text-gray-600">You can track your order by clicking the tracking link in your shipping confirmation email.</p>
              </div>
            ))}
          </div>
          <button className="mt-8 font-bold text-blue-600">View all FAQs</button>
        </div>
        <div className="bg-gray-50 p-8 rounded-2xl">
          <h3 className="text-2xl font-bold mb-6">Still have questions?</h3>
          <form className="space-y-4">
            <input type="text" placeholder="Name" className="w-full p-3 border rounded-lg" />
            <input type="email" placeholder="Email" className="w-full p-3 border rounded-lg" />
            <textarea placeholder="Message" rows={4} className="w-full p-3 border rounded-lg"></textarea>
            <button className="w-full py-3 bg-black text-white font-bold rounded-lg">Submit Question</button>
          </form>
        </div>
      </div>
    </div>
  ),

  'contact-social': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto text-center">
      <EditableText
        value={data?.heading || 'Connect With Us'}
        onChange={(val) => onUpdate?.({ ...data, heading: val })}
        isEditable={isEditable}
        className="text-4xl font-bold mb-12"
      />
      <div className="flex justify-center gap-8 mb-16">
        {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
          <a key={i} href="#" className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-2">
            <Icon size={24} />
          </a>
        ))}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="aspect-square bg-gray-100 rounded-xl overflow-hidden relative group cursor-pointer">
            <img src={`https://images.unsplash.com/photo-${i === 1 ? '1515886657613-9f3515b0c78f' : i === 2 ? '1529139574466-a302358e3381' : '1483985988355-763728e1935b'}?w=400&q=80`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="Social" />
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Instagram className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  ),

  'contact-office': ({ data, isEditable, onUpdate }) => (
    <div className="py-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <EditableText
          value={data?.heading || 'Our Offices'}
          onChange={(val) => onUpdate?.({ ...data, heading: val })}
          isEditable={isEditable}
          className="text-4xl font-bold"
        />
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { city: 'New York', address: '123 Broadway, NY 10012', phone: '+1 (212) 555-0123', img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80' },
          { city: 'London', address: '45 Oxford St, London W1D 2', phone: '+44 20 7123 4567', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80' },
          { city: 'Tokyo', address: '1-1 Shibuya, Tokyo 150-0002', phone: '+81 3 1234 5678', img: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&q=80' }
        ].map((office, i) => (
          <div key={i} className="group cursor-pointer">
            <div className="aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden mb-6">
              <img src={office.img} alt={office.city} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{office.city}</h3>
            <p className="text-gray-600 mb-1">{office.address}</p>
            <p className="text-gray-600">{office.phone}</p>
          </div>
        ))}
      </div>
    </div>
  ),
};
