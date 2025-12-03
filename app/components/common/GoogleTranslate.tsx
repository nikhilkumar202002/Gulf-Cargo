"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { IoLanguage, IoClose } from "react-icons/io5";

// Define your languages
const languages = [
  { code: "en", name: "English", flag: "🇺🇸" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "zh-CN", name: "Chinese", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", flag: "🇯🇵" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "hi", name: "Hindi", flag: "🇮🇳" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "tr", name: "Turkish", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", flag: "🇳🇱" },
  { code: "ko", name: "Korean", flag: "🇰🇷" },
  { code: "pl", name: "Polish", flag: "🇵🇱" },
  { code: "id", name: "Indonesian", flag: "🇮🇩" },
  { code: "vi", name: "Vietnamese", flag: "🇻🇳" },
  { code: "th", name: "Thai", flag: "🇹🇭" },
  { code: "ms", name: "Malay", flag: "🇲🇾" },
  { code: "ur", name: "Urdu", flag: "🇵🇰" },
];

// List of languages that need RTL layout
const rtlLanguages = ["ar", "ur", "fa", "he"]; 

const GoogleTranslate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // 1. Check Cookie & Set Initial RTL/LTR Direction
    const match = document.cookie.match(/googtrans=\/en\/([a-z-]+)/);
    let lang = "en"; // Default

    if (match) {
        lang = match[1];
        setCurrentLang(lang);
    }

    // --- FIX: Force RTL immediately based on cookie ---
    if (rtlLanguages.includes(lang)) {
        document.documentElement.dir = "rtl";
        document.documentElement.lang = lang;
    } else {
        document.documentElement.dir = "ltr";
        document.documentElement.lang = lang;
    }
    // -------------------------------------------------

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);

      (window as any).googleTranslateElementInit = () => {
        new (window as any).google.translate.TranslateElement(
          { pageLanguage: "en", autoDisplay: false },
          "google_translate_element"
        );
      };
    }
  }, []);

  const changeLanguage = (langCode: string) => {
    // 1. Set Cookies
    document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/en/${langCode}; path=/;`; // Fallback
    
    // 2. Update State
    setCurrentLang(langCode);
    setIsOpen(false);

    // 3. Force RTL Update before reload (optional, but good for perceived speed)
    if (rtlLanguages.includes(langCode)) {
        document.documentElement.dir = "rtl";
    } else {
        document.documentElement.dir = "ltr";
    }

    // 4. Reload page to apply translation
    window.location.reload();
  };

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* 1. TRIGGER BUTTON */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-.9 rounded-full border border-gray-200 hover:border-[#ED2624] hover:text-[#ED2624] transition-all bg-white"
      >
        <IoLanguage className="text-sm text-black" />
        <span className="text-sm font-medium uppercase text-black">{currentLang}</span>
      </button>

      {/* 2. THE MODAL */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-800 text-lg">Select Language</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 bg-white rounded-full hover:bg-red-50 hover:text-red-500 transition-colors shadow-sm"
              >
                <IoClose size={20} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all border
                      ${currentLang === lang.code 
                        ? "border-[#ED2624] bg-red-50 text-[#ED2624] shadow-sm" 
                        : "border-gray-100 bg-white text-gray-600 hover:border-gray-300 hover:shadow-md"}
                    `}
                  >
                    <span className="text-2xl">{lang.flag}</span>
                    <span className="font-medium text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-3 text-center text-xs text-gray-400">
              Powered by Google Translate
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. Hidden Google Widget */}
      <div 
        id="google_translate_element" 
        style={{ display: "none", visibility: "hidden", height: 0, width: 0 }} 
      />
    </>
  );
};

export default GoogleTranslate;