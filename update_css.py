import re

with open('assets/css/main.css', 'r') as f:
    content = f.read()

# 1. Update Heading Font to Playfair Display
font_var_pattern = r'--heading-font: "Inter", sans-serif;'
content = re.sub(font_var_pattern, '--heading-font: "Playfair Display", serif;', content)

# 2. Add organic morphing animation to glass panels
glass_panel_pattern = r'/\*--------------------------------------------------------------\n# Glassmorphism Base & Organics\n--------------------------------------------------------------\*/.*?/\*--------------------------------------------------------------\n# About Section'

new_glass_panel = '''/*--------------------------------------------------------------
# Glassmorphism Base & Organics
--------------------------------------------------------------*/
@keyframes organic-morph {
  0%   { border-radius: 32px 40px 30px 45px / 45px 30px 40px 32px; }
  50%  { border-radius: 45px 30px 40px 32px / 32px 40px 30px 45px; }
  100% { border-radius: 32px 40px 30px 45px / 45px 30px 40px 32px; }
}

@keyframes glass-breathe {
  0%   { box-shadow: 0 16px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 rgba(255, 255, 255, 0.1); }
  50%  { box-shadow: 0 20px 50px rgba(139, 204, 155, 0.08), inset 0 0 20px rgba(255, 255, 255, 0.3); }
  100% { box-shadow: 0 16px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 rgba(255, 255, 255, 0.1); }
}

.glass-panel {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 32px; 
  animation: organic-morph 12s ease-in-out infinite, glass-breathe 8s ease-in-out infinite;
  transition: background 0.6s ease, border-color 0.6s ease;
  position: relative;
  overflow: hidden;
}

.glass-panel::before {
  content: '';
  position: absolute;
  top: 0; left: -100%; width: 50%; height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent);
  transform: skewX(-20deg);
  transition: all 0.8s ease;
  z-index: 0;
  pointer-events: none;
}

.glass-panel:hover {
  background: rgba(255, 255, 255, 0.75);
  border-color: rgba(139, 204, 155, 0.6);
  animation: organic-morph 6s ease-in-out infinite, glass-breathe 4s ease-in-out infinite;
}

.glass-panel:hover::before {
  left: 200%;
}

.glass-panel > * {
  position: relative;
  z-index: 1;
}

.dark-background .glass-panel {
  background: rgba(25, 45, 30, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.dark-background .glass-panel:hover {
  background: rgba(40, 70, 50, 0.4);
  border-color: rgba(139, 204, 155, 0.4);
}

/*--------------------------------------------------------------
# About Section'''
content = re.sub(glass_panel_pattern, new_glass_panel, content, flags=re.DOTALL)

# 3. Remove standard hovers
focus_hover_pattern = r'\.focus-item:hover \{.*?\}'
new_focus_hover = '''.focus-item:hover { }'''
content = re.sub(focus_hover_pattern, new_focus_hover, content, flags=re.DOTALL)

contact_hover_pattern = r'\.contact-card:hover \{.*?\}'
new_contact_hover = '''.contact-card:hover { }'''
content = re.sub(contact_hover_pattern, new_contact_hover, content, flags=re.DOTALL)

# 4. Fix Image CSS
img_css_pattern = r'\.about-profile-img \{.*?\}'
new_img_css = '''.about-profile-img {
  border-radius: inherit;
  max-width: 260px;
  width: 100%;
  filter: grayscale(20%) sepia(0.6) hue-rotate(60deg);
  transition: filter 0.8s ease;
  object-fit: cover;
  aspect-ratio: 4/5;
}

.profile-wrapper:hover .about-profile-img {
  filter: grayscale(0%) sepia(0) hue-rotate(0deg);
}'''
content = re.sub(img_css_pattern, new_img_css, content, flags=re.DOTALL)

# 5. Update Hero Title
hero_title_pattern = r'\.hero-title \{.*?\}'
new_hero_title = '''.hero-title {
  margin: 0 0 12px 0;
  font-size: clamp(44px, 9vw, 86px);
  font-family: var(--heading-font);
  font-weight: 500;
  font-style: italic;
  color: #ffffff;
  letter-spacing: -0.02em;
  text-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
}'''
content = re.sub(hero_title_pattern, new_hero_title, content, flags=re.DOTALL)

with open('assets/css/main.css', 'w') as f:
    f.write(content)

