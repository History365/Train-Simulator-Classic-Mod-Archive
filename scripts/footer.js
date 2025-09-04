document.addEventListener('DOMContentLoaded', function () {
  const footer = document.getElementById('dynamicFooter');
  footer.classList.add(
    'footer',
    'bg-gray-100',
    'p-4',
    'rounded-xl',
    'shadow-md',
    'text-center',
    'mt-10'
  );

  const footerLinks = [
    { text: 'Privacy Policy', href: '../privacy-policy.html' },
    { text: 'Terms of Use', href: '#' },
    { text: 'About Us', href: '#' },
  ];

  const linkContainer = document.createElement('p');
  linkContainer.className = 'space-x-5 text-left';

  footerLinks.forEach(link => {
    const anchor = document.createElement('a');
    anchor.href = link.href;
    anchor.className = 'hover:underline text-blue-600 hover:text-blue-800 font-medium';
    anchor.textContent = link.text;
    linkContainer.appendChild(anchor);
  });

  const copyright = document.createElement('p');
  copyright.className = 'mt-2 text-gray-600 text-left';
  copyright.textContent = '© 2025 Train Simulator Mod Archive';

  footer.appendChild(linkContainer);
  footer.appendChild(copyright);
});