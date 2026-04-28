(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    loadEvents();
  });

  function escapeHtml(s) {
    if (s == null) return '';
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeAttr(s) { return escapeHtml(s); }

  // Allow attribute values that contain query strings / ampersands without
  // breaking; we escape but preserve the URL semantics
  function safeUrl(s) {
    if (!s) return '#';
    return String(s).replace(/"/g, '&quot;').replace(/&/g, '&amp;');
  }

  function parseISODate(iso) {
    if (!iso) return null;
    const parts = iso.split('-');
    if (parts.length < 3) return null;
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }

  function formatMonth(d) {
    return d.toLocaleString('en-US', { month: 'long' });
  }
  function formatMonthShort(d) {
    return d.toLocaleString('en-US', { month: 'short' });
  }
  function formatDay(d) { return String(d.getDate()); }
  function formatYear(d) { return String(d.getFullYear()); }
  function formatWeekday(d) {
    return d.toLocaleString('en-US', { weekday: 'long' });
  }
  function formatLongDate(d) {
    return d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  }

  async function loadEvents() {
    const upcomingTarget = document.getElementById('upcoming-events');
    const pastTarget = document.getElementById('past-events');
    const spotlightTarget = document.getElementById('homepage-event-spotlight');

    if (!upcomingTarget && !pastTarget && !spotlightTarget) return;

    let data;
    try {
      const res = await fetch('data/events.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('events.json fetch failed: ' + res.status);
      data = await res.json();
    } catch (err) {
      console.error('Could not load events:', err);
      return;
    }

    const events = (data && data.events) ? data.events : [];
    const upcoming = events.filter(e => e.status === 'upcoming');
    const past = events.filter(e => e.status === 'past');

    if (upcomingTarget) {
      upcomingTarget.innerHTML = upcoming.map((e, i) => renderUpcomingEvent(e, i === upcoming.length - 1)).join('');
    }
    // Update header text on events.html to scale with the number of upcoming events
    const upcomingHeader = document.getElementById('upcoming-events-header');
    if (upcomingHeader) {
      upcomingHeader.textContent = upcoming.length === 0
        ? 'No upcoming events.'
        : (upcoming.length === 1 ? 'One event on the calendar.' : `${upcoming.length} events on the calendar.`);
    }
    if (pastTarget) {
      pastTarget.innerHTML = past.map(renderPastEventCard).join('');
    }
    if (spotlightTarget && upcoming.length) {
      spotlightTarget.innerHTML = renderHomepageSpotlight(upcoming[0]);
    }

    rebindReveals();
  }

  function rebindReveals() {
    if (!('IntersectionObserver' in window)) return;
    const targets = document.querySelectorAll('.reveal-up:not(.is-visible), .fade-in:not(.is-visible)');
    if (!targets.length) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(function (el) { observer.observe(el); });
  }

  function renderUpcomingEvent(e, isLast) {
    const d = parseISODate(e.date);
    if (!d) return '';
    const month = formatMonthShort(d).toUpperCase();
    const day = formatDay(d);
    const year = formatYear(d);
    const weekday = formatWeekday(d);
    const longDate = formatLongDate(d);
    const titleItalic = e.title_italic_part || '';
    const titleMain = titleItalic && e.title && e.title.endsWith(titleItalic)
      ? e.title.slice(0, e.title.length - titleItalic.length).trim()
      : (e.title || '');

    const hasVenue = !!(e.venue_name || e.venue_address_line1 || e.venue_city);
    const hasDescription = !!(e.description_intro || e.description_body);
    const hasTime = !!(e.time_start || e.time_end);
    const hasCalendarLinks = !!(e.google_calendar_url || e.ical_url || e.outlook365_url || e.outlook_live_url);
    const hasDetails = hasTime || e.cost || e.category;

    const venueAddrFull = [
      e.venue_address_line1,
      [e.venue_city, e.venue_state, e.venue_zip].filter(Boolean).join(', ')
    ].filter(Boolean).join(', ');

    const mapsQuery = encodeURIComponent([
      e.venue_address_line1,
      e.venue_city, e.venue_state, e.venue_zip
    ].filter(Boolean).join(' '));

    const phoneTel = e.venue_phone ? e.venue_phone.replace(/[^0-9+]/g, '') : '';

    // Date strip used when there's no image (becomes a small standalone date row instead of overlaying nothing)
    const dateBadgeStandalone = `
      <div class="inline-flex items-center gap-4 mb-8 border-l-2 border-gold pl-5 py-2">
        <div>
          <p class="eyebrow text-terracotta mb-1">${escapeHtml(month)}</p>
          <p class="font-serif text-3xl text-forest leading-none">${escapeHtml(day)}</p>
          <p class="text-xs uppercase tracking-[0.18em] text-sage mt-1">${escapeHtml(year)}</p>
        </div>
      </div>`;

    // If the event has barely any data, render a compact card instead of the full hero
    const isMinimal = !e.image && !hasDescription && !hasVenue && !hasCalendarLinks;
    if (isMinimal) {
      return `
        <div class="${isLast ? '' : 'mb-12 pb-12 border-b border-stone'} reveal-up">
          ${dateBadgeStandalone}
          <h3 class="font-serif text-2xl md:text-3xl text-forest leading-tight mb-3">
            ${escapeHtml(titleMain)}${titleItalic ? ` <span class="italic text-gold">${escapeHtml(titleItalic)}</span>` : ''}
          </h3>
          ${hasTime ? `<p class="font-serif text-base text-sage mb-3">${escapeHtml(e.time_start || '')}${e.time_end ? ' – ' + escapeHtml(e.time_end) : ''}${e.timezone ? ' ' + escapeHtml(e.timezone) : ''}</p>` : ''}
          ${e.category ? `<p class="text-xs uppercase tracking-[0.15em] text-sage/80 mb-4">${escapeHtml(e.category)}</p>` : ''}
          ${e.rsvp_url ? `<a href="${safeUrl(e.rsvp_url)}"${e.rsvp_url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''} class="link-underline text-sm">${escapeHtml(e.rsvp_label || 'Event details')} →</a>` : `<p class="text-sm text-charcoal/50 italic">Add an image, description, and venue to make this event feature-ready.</p>`}
        </div>
      `;
    }

    return `
      <div class="${isLast ? '' : 'mb-20 pb-20 border-b border-stone'} grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        <div class="lg:col-span-7 reveal-up">
          ${e.image ? `
          <div class="image-frame aspect-[5/4] mb-10 relative">
            <img src="${safeUrl(e.image)}" alt="${escapeAttr(e.title || '')}" loading="lazy" class="w-full h-full object-cover">
            <div class="absolute top-6 left-6 bg-cream/95 backdrop-blur px-5 py-4 border-l-2 border-gold">
              <p class="eyebrow text-terracotta mb-1">${escapeHtml(month)}</p>
              <p class="font-serif text-4xl text-forest leading-none">${escapeHtml(day)}</p>
              <p class="text-xs uppercase tracking-[0.18em] text-sage mt-1.5">${escapeHtml(year)}</p>
            </div>
          </div>` : dateBadgeStandalone}

          <h3 class="font-serif text-3xl md:text-4xl text-forest mb-4 leading-tight">
            ${escapeHtml(titleMain)}${titleItalic ? ` <span class="italic text-gold">${escapeHtml(titleItalic)}</span>` : ''}
          </h3>
          <p class="font-serif text-lg text-sage mb-8">${escapeHtml(formatLongDate(d).replace(/, \d{4}/, ''))}${hasTime ? ` <span class="text-charcoal/40">@</span> ${escapeHtml(e.time_start || '')}${e.time_end ? ' – ' + escapeHtml(e.time_end) : ''}` : ''}</p>

          ${hasDescription ? `
          <div class="prose-editorial text-charcoal/85 max-w-2xl">
            ${e.description_intro ? `<p class="font-serif text-xl text-forest leading-relaxed">${escapeHtml(e.description_intro)}</p>` : ''}
            ${e.description_body ? `<p>${escapeHtml(e.description_body)}</p>` : ''}
          </div>` : ''}

          ${hasCalendarLinks ? `
          <div class="mt-10">
            <p class="eyebrow text-sage mb-5"><span class="rule"></span>Add to Calendar</p>
            <div class="flex flex-wrap gap-2">
              ${e.google_calendar_url ? `<a href="${safeUrl(e.google_calendar_url)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-forest border border-stone hover:border-gold bg-cream transition"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>Google Calendar</a>` : ''}
              ${e.ical_url ? `<a href="${safeUrl(e.ical_url)}" class="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-forest border border-stone hover:border-gold bg-cream transition"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18"/></svg>iCalendar</a>` : ''}
              ${e.outlook365_url ? `<a href="${safeUrl(e.outlook365_url)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-forest border border-stone hover:border-gold bg-cream transition"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M8 10h8M8 14h5"/></svg>Outlook 365</a>` : ''}
              ${e.outlook_live_url ? `<a href="${safeUrl(e.outlook_live_url)}" target="_blank" rel="noopener" class="inline-flex items-center gap-2 px-4 py-2.5 text-sm text-forest border border-stone hover:border-gold bg-cream transition"><svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="1"/><path d="M3 10h18"/></svg>Outlook Live</a>` : ''}
            </div>
          </div>` : ''}

          <div class="mt-10 flex flex-col sm:flex-row gap-4">
            ${e.rsvp_url ? `<a href="${safeUrl(e.rsvp_url)}"${e.rsvp_url.startsWith('http') ? ' target="_blank" rel="noopener"' : ''} class="btn-primary">${escapeHtml(e.rsvp_label || 'Event Details')}<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg></a>` : ''}
            <a href="https://givebutter.com/investinWSI" target="_blank" rel="noopener" class="btn-gold btn-gold--shine">Support the Mission</a>
          </div>
        </div>

        ${(hasDetails || hasVenue) ? `
        <aside class="lg:col-span-5 reveal-up delay-1">
          <div class="bg-cream border border-stone p-8 md:p-10 space-y-8 lg:sticky lg:top-32">
            ${hasDetails ? `
            <div>
              <p class="eyebrow text-sage mb-5">Details</p>
              <dl class="space-y-4 text-sm">
                <div class="flex justify-between gap-4 border-b border-stone pb-3"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Date</dt><dd class="text-forest font-medium">${escapeHtml(weekday.slice(0,3))}, ${escapeHtml(longDate)}</dd></div>
                ${hasTime ? `<div class="flex justify-between gap-4 border-b border-stone pb-3"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Time</dt><dd class="text-forest font-medium">${escapeHtml(e.time_start || '')}${e.time_end ? ' – ' + escapeHtml(e.time_end) : ''} ${escapeHtml(e.timezone || '')}</dd></div>` : ''}
                ${e.cost ? `<div class="flex justify-between gap-4 border-b border-stone pb-3"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Cost</dt><dd class="text-forest font-medium">${escapeHtml(e.cost)}</dd></div>` : ''}
                ${e.category ? `<div class="flex justify-between gap-4"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Category</dt><dd class="text-forest font-medium">${escapeHtml(e.category)}</dd></div>` : ''}
              </dl>
            </div>` : ''}
            ${hasVenue ? `
            <div class="${hasDetails ? 'pt-2 border-t border-stone' : ''}">
              <p class="eyebrow text-sage mb-4 ${hasDetails ? 'pt-6' : ''}">Venue</p>
              ${e.venue_name ? `<p class="font-serif text-lg text-forest leading-snug">${escapeHtml(e.venue_name)}</p>` : ''}
              ${venueAddrFull ? `<address class="not-italic text-sm text-charcoal/80 mt-2 leading-relaxed">${escapeHtml(e.venue_address_line1 || '')}${e.venue_address_line1 ? '<br>' : ''}${escapeHtml(e.venue_city || '')}${e.venue_state ? ', ' + escapeHtml(e.venue_state) : ''} ${escapeHtml(e.venue_zip || '')}</address>` : ''}
              ${e.venue_phone ? `<p class="text-sm text-charcoal/70 mt-3"><span class="text-xs uppercase tracking-wider text-sage">Phone</span><br><a href="tel:${escapeAttr(phoneTel)}" class="text-forest hover:text-terracotta transition">${escapeHtml(e.venue_phone)}</a></p>` : ''}
              ${(mapsQuery || e.venue_url) ? `
              <div class="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                ${mapsQuery ? `<a href="https://maps.google.com/maps?q=${mapsQuery}" target="_blank" rel="noopener" class="link-underline text-sm"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="1.8" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/></svg>Google Map</a>` : ''}
                ${e.venue_url ? `<a href="${safeUrl(e.venue_url)}" target="_blank" rel="noopener" class="link-underline text-sm">Venue Website</a>` : ''}
              </div>` : ''}
            </div>` : ''}
          </div>
        </aside>` : ''}
      </div>
    `;
  }

  function renderPastEventCard(e) {
    const d = parseISODate(e.date);
    const yearStr = d ? formatYear(d) : '';
    const dateLabel = d ? formatLongDate(d) : '';
    const venue = e.venue_name || '';

    return `
      <article class="card-editorial group reveal-up">
        <a href="${safeUrl(e.rsvp_url || '#')}" ${e.rsvp_url && e.rsvp_url.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} class="block">
          <div class="image-frame aspect-[4/5]">
            <img src="${safeUrl(e.image)}" alt="${escapeAttr(e.title)}" loading="lazy" class="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 transition duration-700">
          </div>
          <div class="p-7">
            <p class="eyebrow text-sage mb-3">Past · ${escapeHtml(yearStr)}</p>
            <h3 class="font-serif text-xl md:text-2xl text-forest leading-snug mb-2">${escapeHtml(e.title)}</h3>
            <p class="text-sm text-charcoal/60 mb-3">${escapeHtml(dateLabel)}${venue ? ' · ' + escapeHtml(venue) : ''}</p>
            ${e.description_intro ? `<p class="text-charcoal/75 text-sm leading-relaxed">${escapeHtml(e.description_intro)}</p>` : ''}
            <span class="mt-5 inline-block text-sm font-medium text-forest border-b border-forest pb-0.5 group-hover:text-terracotta group-hover:border-terracotta transition">${escapeHtml(e.rsvp_label || 'Learn more')} →</span>
          </div>
        </a>
      </article>
    `;
  }

  function renderHomepageSpotlight(e) {
    const d = parseISODate(e.date);
    if (!d) return '';
    const dayNum = formatDay(d);
    const monthShort = formatMonthShort(d);
    const year = formatYear(d);
    const weekday = formatWeekday(d);
    const titleItalic = e.title_italic_part || '';
    const titleMain = titleItalic && e.title.endsWith(titleItalic)
      ? e.title.slice(0, e.title.length - titleItalic.length).trim()
      : e.title;

    return `
      <div class="max-w-7xl mx-auto px-6 md:px-12">
        <div class="mb-10 reveal-up">
          <a href="events.html" class="text-sm text-sage hover:text-forest transition inline-flex items-center gap-2 tracking-wide">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            All Events
          </a>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14 mb-14 md:mb-20 items-end">
          <div class="md:col-span-8 reveal-up">
            <p class="eyebrow text-terracotta mb-5"><span class="rule"></span>${escapeHtml(e.category || 'Upcoming Event')}</p>
            <h2 class="section-heading mb-5">
              ${escapeHtml(titleMain)}${titleItalic ? `<br><span class="italic font-normal text-gold">${escapeHtml(titleItalic)}</span>` : ''}
            </h2>
            <p class="font-serif text-xl md:text-2xl text-forest leading-snug">
              ${escapeHtml(formatMonth(d))} ${escapeHtml(dayNum)} <span class="text-sage">@</span> ${escapeHtml(e.time_start || '')}${e.time_end ? ' – ' + escapeHtml(e.time_end) : ''}
            </p>
          </div>
          <div class="md:col-span-4 reveal-up delay-1">
            <div class="border border-stone bg-cream p-6 flex items-center gap-5">
              <div class="text-center border-r border-stone pr-5">
                <p class="eyebrow text-terracotta text-[0.6rem]">${escapeHtml(monthShort)}</p>
                <p class="font-serif text-5xl text-forest leading-none mt-1">${escapeHtml(dayNum)}</p>
                <p class="text-xs uppercase tracking-wider text-sage mt-1">${escapeHtml(year)}</p>
              </div>
              <div class="text-sm leading-relaxed">
                <p class="text-forest font-medium">${escapeHtml(weekday)} evening</p>
                <p class="text-charcoal/70">${escapeHtml(e.venue_city || '')}${e.venue_state ? ', ' + escapeHtml(e.venue_state) : ''}</p>
                <p class="text-charcoal/70 mt-1">${escapeHtml(e.category || '')}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="image-frame aspect-[16/7] mb-14 md:mb-20 reveal-up">
          <img src="${safeUrl(e.image)}" alt="${escapeAttr(e.title)}" loading="lazy" class="w-full h-full object-cover">
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          <div class="lg:col-span-7 reveal-up">
            <p class="eyebrow text-sage mb-6"><span class="rule"></span>About the Evening</p>
            <div class="prose-editorial text-charcoal/85 max-w-2xl">
              ${e.description_intro ? `<p class="font-serif text-xl text-forest leading-relaxed">${escapeHtml(e.description_intro)}</p>` : ''}
              ${e.description_body ? `<p>${escapeHtml(e.description_body)}</p>` : ''}
            </div>
            <div class="mt-12 flex flex-col sm:flex-row gap-4">
              ${e.rsvp_url ? `<a href="${safeUrl(e.rsvp_url)}" target="_blank" rel="noopener" class="btn-primary">${escapeHtml(e.rsvp_label || 'Event Details')}<svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14m-6-6 6 6-6 6"/></svg></a>` : ''}
              <a href="https://givebutter.com/investinWSI" target="_blank" rel="noopener" class="btn-gold btn-gold--shine">Support the Mission</a>
            </div>
          </div>

          <aside class="lg:col-span-5 reveal-up delay-1">
            <div class="bg-stone/40 border border-stone p-8 md:p-10 space-y-8">
              <div>
                <p class="eyebrow text-sage mb-5">Details</p>
                <dl class="space-y-4 text-sm">
                  <div class="flex justify-between gap-4 border-b border-stone pb-3"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Date</dt><dd class="text-forest font-medium">${escapeHtml(formatLongDate(d))}</dd></div>
                  ${(e.time_start || e.time_end) ? `<div class="flex justify-between gap-4 border-b border-stone pb-3"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Time</dt><dd class="text-forest font-medium">${escapeHtml(e.time_start || '')}${e.time_end ? ' – ' + escapeHtml(e.time_end) : ''} ${escapeHtml(e.timezone || '')}</dd></div>` : ''}
                  ${e.cost ? `<div class="flex justify-between gap-4 border-b border-stone pb-3"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Cost</dt><dd class="text-forest font-medium">${escapeHtml(e.cost)}</dd></div>` : ''}
                  ${e.category ? `<div class="flex justify-between gap-4"><dt class="text-charcoal/60 uppercase tracking-wider text-xs">Category</dt><dd class="text-forest font-medium">${escapeHtml(e.category)}</dd></div>` : ''}
                </dl>
              </div>
              ${e.venue_name ? `
              <div class="pt-2 border-t border-stone">
                <p class="eyebrow text-sage mb-4 pt-6">Venue</p>
                <p class="font-serif text-lg text-forest leading-snug">${escapeHtml(e.venue_name)}</p>
                <address class="not-italic text-sm text-charcoal/80 mt-2 leading-relaxed">${escapeHtml(e.venue_address_line1 || '')}${e.venue_address_line1 ? '<br>' : ''}${escapeHtml(e.venue_city || '')}${e.venue_state ? ', ' + escapeHtml(e.venue_state) : ''} ${escapeHtml(e.venue_zip || '')}</address>
                ${e.venue_url ? `<div class="mt-3"><a href="${safeUrl(e.venue_url)}" target="_blank" rel="noopener" class="link-underline text-sm">Venue Website</a></div>` : ''}
              </div>` : ''}
            </div>
          </aside>
        </div>
      </div>
    `;
  }

})();
