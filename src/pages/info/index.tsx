import React from "react";
import { useState } from "react";

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

function WifiIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  );
}

function LockerIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
    </svg>
  );
}

function MedicalIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function PartyIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
    </svg>
  );
}

function SchoolIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}

function RestaurantIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  );
}

function GrillIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

const services = [
  { icon: WifiIcon, label: "Wi-Fi" },
  { icon: LockerIcon, label: "Vestuario" },
  { icon: MedicalIcon, label: "Ayuda Médica" },
  { icon: TrophyIcon, label: "Torneos" },
  { icon: PartyIcon, label: "Cumpleaños" },
  { icon: SchoolIcon, label: "Escuelita deportiva" },
  { icon: RestaurantIcon, label: "Bar / Restaurante" },
  { icon: GrillIcon, label: "Quincho" },
];

function InfoPageSection() {
  const [openAccordion, setOpenAccordion] = useState<string | null>("ubicacion");

  const accordionItems: AccordionItem[] = [
    {
      id: "ubicacion",
      title: "Ubicación",
      content: (
        <div>
          <p className="text-(--gray-600)">
            Blvd. 27 de Febrero 2672, Rosario, Argentina
          </p>
          <p className="text-(--gray-600)">
            Telefono: (0341) 123-4567
          </p>
        </div>
      ),
    },
    {
      id: "horarios",
      title: "Horarios del Club",
      content: (
        <div className="space-y-2 text-(--gray-600)">
          <p><strong>Lunes, Martes, Miércoles, Jueves, Viernes</strong> 8:00 am a 12:00 pm</p>
          <p><strong>Domingo:</strong> 9:00 am a 12:00 pm</p>
          <p><strong>Sábado:</strong> 9:00 am a 12:00 pm</p>
          <p><strong>Feriados:</strong> 8:00 am a 12:00 pm</p>
        </div>
      ),
    },
    {
      id: "servicios",
      title: "Servicios del Club",
      content: (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {services.map((service) => (
            <div key={service.label} className="flex items-center gap-2 text-(--gray-600)">
              <service.icon />
              <span>{service.label}</span>
            </div>
          ))}
        </div>
      ),
    },
  ];

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <section id="info" className="py-12 px-4 bg-(--gray-100)">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-(--gray-900) mb-8">
          Donde estamos
        </h2>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Map */}
          <div className="lg:col-span-3 bg-white rounded-lg overflow-hidden border border-(--gray-200)">
            <div className="p-4 border-b border-(--gray-200)">
              <p className="font-semibold text-(--gray-900)">32 57'43.2"S 60 39'39.5"W</p>
              <p className="text-sm text-(--gray-500)">28QQ+5JR Rosario, Santa Fe</p>
              <div className="flex gap-4 mt-2">
                <a 
                  href="https://maps.app.goo.gl/akz61AG7e5fBu3fE8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-(--green-600) text-sm font-medium"
                >
                  Cómo llegar
                </a>
                <a 
                  href="https://maps.app.goo.gl/akz61AG7e5fBu3fE8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-(--green-600) text-sm font-medium"
                >
                  Ampliar el mapa
                </a>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3348.123456789!2d-60.66!3d-32.962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDU3JzQzLjIiUyA2MMKwMzknMzkuNSJX!5e0!3m2!1ses!2sar!4v1234567890"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de El Ovalo"
              className="w-full"
            />
          </div>

          {/* Info Cards */}
          <div className="lg:col-span-2 space-y-4">
            {accordionItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg border border-(--gray-200) overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-(--gray-50) transition-colors"
                >
                  <span className="font-semibold text-(--gray-900)">{item.title}</span>
                  <svg
                    className={`w-5 h-5 text-(--gray-500) transition-transform ${
                      openAccordion === item.id ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openAccordion === item.id && (
                  <div className="px-4 pb-4">{item.content}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InfoPageSection;