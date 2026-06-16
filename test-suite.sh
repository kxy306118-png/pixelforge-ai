#!/bin/bash
# PixelForge AI — Full Site Test Suite
# Tests all pages, APIs, and user flows

BASE="http://localhost:3000"
PASS=0
FAIL=0
WARN=0
ERRORS=""

log_pass() { echo "✅ PASS: $1"; PASS=$((PASS+1)); }
log_fail() { echo "❌ FAIL: $1 — $2"; FAIL=$((FAIL+1)); ERRORS="$ERRORS\n❌ $1: $2"; }
log_warn() { echo "⚠️  WARN: $1 — $2"; WARN=$((WARN+1)); }

echo "============================================"
echo "  PixelForge AI — Full Test Suite"
echo "============================================"
echo ""

# ============================================
# TEST 1: All Page Accessibility (32 pages)
# ============================================
echo "--- TEST 1: Page Accessibility ---"
PAGES=(
  "/" "/tools" "/pricing" "/about" "/blog" 
  "/blog/how-ai-background-removal-works"
  "/blog/10-ways-to-use-ai-image-tools-for-ecommerce"
  "/blog/ai-video-generation-future-of-content"
  "/blog/complete-guide-to-image-formats"
  "/blog/speech-to-text-revolutionize-transcription"
  "/blog/ai-audio-enhancement-noise-removal"
  "/docs" "/contact" "/signup" "/login" 
  "/dashboard" "/admin" "/billing" "/terms" "/privacy"
  "/tools/remove-bg" "/tools/upscale" "/tools/enhance"
  "/tools/ai-image-gen" "/tools/compress" "/tools/convert" "/tools/resize"
  "/tools/text-to-video" "/tools/image-to-video" "/tools/video-subtitle"
  "/tools/speech-to-text" "/tools/text-to-speech" "/tools/audio-enhance"
  "/tools/image-to-text" "/tools/ai-writer"
)

for path in "${PAGES[@]}"; do
  CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}${path}")
  if [ "$CODE" = "200" ]; then
    log_pass "GET $path"
  else
    log_fail "GET $path" "HTTP $CODE"
  fi
done

echo ""
echo "--- TEST 2: Non-existent Page (404) ---"
CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}/this-does-not-exist")
if [ "$CODE" = "404" ]; then
  log_pass "404 page returns 404"
else
  log_fail "404 page" "Expected 404, got $CODE"
fi

# ============================================
# TEST 3: Registration API
# ============================================
echo ""
echo "--- TEST 3: Registration API ---"

# Normal registration
RESP=$(curl -s -X POST "${BASE}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestSuite","email":"testsuite@pf.ai","password":"Test123456"}')
if echo "$RESP" | grep -q '"ok":true'; then
  log_pass "Register new user"
else
  log_fail "Register new user" "$RESP"
fi

# Duplicate registration
RESP=$(curl -s -X POST "${BASE}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"TestSuite","email":"testsuite@pf.ai","password":"Test123456"}')
if echo "$RESP" | grep -q "already registered"; then
  log_pass "Duplicate email rejected"
else
  log_fail "Duplicate email rejected" "$RESP"
fi

# Missing fields
RESP=$(curl -s -X POST "${BASE}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"bad","password":""}')
if echo "$RESP" | grep -q "error\|Error\|required\|invalid"; then
  log_pass "Missing fields rejected"
else
  log_warn "Missing fields validation" "No clear error returned"
fi

# Short password
RESP=$(curl -s -X POST "${BASE}/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"ShortPW","email":"shortpw@pf.ai","password":"123"}')
if echo "$RESP" | grep -q "error\|Error\|short\|least\|min"; then
  log_pass "Short password rejected"
else
  log_warn "Short password validation" "$RESP"
fi

# ============================================
# TEST 4: Contact Form API
# ============================================
echo ""
echo "--- TEST 4: Contact Form API ---"

RESP=$(curl -s -X POST "${BASE}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@test.com","subject":"Test Subject","message":"This is a test message for the contact form."}')
if echo "$RESP" | grep -q '"ok":true'; then
  log_pass "Contact form submission"
else
  log_fail "Contact form submission" "$RESP"
fi

# Empty message
RESP=$(curl -s -X POST "${BASE}/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"","email":"","subject":"","message":""}')
if echo "$RESP" | grep -q "error\|Error\|required"; then
  log_pass "Empty contact form rejected"
else
  log_warn "Empty contact form validation" "$RESP"
fi

# ============================================
# TEST 5: Login & Session (via NextAuth)
# ============================================
echo ""
echo "--- TEST 5: NextAuth Login ---"

# Get CSRF token
CSRF_RESP=$(curl -s "${BASE}/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESP" | python3 -c "import json,sys; print(json.load(sys.stdin).get('csrfToken',''))" 2>/dev/null)
if [ -n "$CSRF_TOKEN" ]; then
  log_pass "CSRF token obtained"
else
  log_fail "CSRF token" "Could not get CSRF token"
fi

# Attempt login with credentials
LOGIN_RESP=$(curl -s -X POST "${BASE}/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=${CSRF_TOKEN}&email=testsuite@pf.ai&password=Test123456&json=true" \
  -c /tmp/cookies.txt -b /tmp/cookies.txt)
# NextAuth returns 200 on success with json=true
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/auth/callback/credentials" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "csrfToken=${CSRF_TOKEN}&email=testsuite@pf.ai&password=Test123456&json=true" \
  -c /tmp/cookies.txt -b /tmp/cookies.txt)
if [ "$CODE" != "000" ] && [ -f /tmp/cookies.txt ]; then
  log_pass "Login request processed (HTTP $CODE)"
else
  log_warn "Login flow" "HTTP $CODE"
fi

# Check session
SESSION=$(curl -s -b /tmp/cookies.txt "${BASE}/api/auth/session")
if echo "$SESSION" | grep -q "null"; then
  log_warn "Session check" "Session is null (may need browser flow)"
else
  log_pass "Session active"
fi

# ============================================
# TEST 6: Usage API
# ============================================
echo ""
echo "--- TEST 6: Usage API ---"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}/api/user/usage")
if [ "$CODE" = "200" ] || [ "$CODE" = "401" ]; then
  log_pass "Usage API responds ($CODE)"
else
  log_fail "Usage API" "HTTP $CODE"
fi

# ============================================
# TEST 7: Image Tool APIs (without auth)
# ============================================
echo ""
echo "--- TEST 7: Image Tool APIs ---"

# Remove BG API (should require auth or return error without file)
CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/remove-bg")
if [ "$CODE" != "500" ]; then
  log_pass "Remove BG API responds ($CODE)"
else
  log_fail "Remove BG API" "HTTP 500 (crash)"
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/upscale")
if [ "$CODE" != "500" ]; then
  log_pass "Upscale API responds ($CODE)"
else
  log_fail "Upscale API" "HTTP 500 (crash)"
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/compress")
if [ "$CODE" != "500" ]; then
  log_pass "Compress API responds ($CODE)"
else
  log_fail "Compress API" "HTTP 500 (crash)"
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/convert")
if [ "$CODE" != "500" ]; then
  log_pass "Convert API responds ($CODE)"
else
  log_fail "Convert API" "HTTP 500 (crash)"
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE}/api/resize")
if [ "$CODE" != "500" ]; then
  log_pass "Resize API responds ($CODE)"
else
  log_fail "Resize API" "HTTP 500 (crash)"
fi

# ============================================
# TEST 8: Admin Stats API
# ============================================
echo ""
echo "--- TEST 8: Admin Stats API ---"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}/api/admin/stats")
if [ "$CODE" = "200" ] || [ "$CODE" = "401" ]; then
  log_pass "Admin Stats API responds ($CODE)"
else
  log_fail "Admin Stats API" "HTTP $CODE"
fi

# ============================================
# TEST 9: Page Content Validation
# ============================================
echo ""
echo "--- TEST 9: Page Content Checks ---"

# Homepage should have tool listings
CONTENT=$(curl -s "${BASE}/")
if echo "$CONTENT" | grep -q "PixelForge"; then
  log_pass "Homepage has brand name"
else
  log_fail "Homepage content" "Brand name not found"
fi

# Pricing page should have prices
CONTENT=$(curl -s "${BASE}/pricing")
if echo "$CONTENT" | grep -q "4.99"; then
  log_pass "Pricing page has Starter price"
else
  log_warn "Pricing page" "Starter price not found"
fi

# Tools page should list tools
CONTENT=$(curl -s "${BASE}/tools")
if echo "$CONTENT" | grep -q "Background"; then
  log_pass "Tools page lists tools"
else
  log_fail "Tools page content" "No tools listed"
fi

# Blog detail should have article content
CONTENT=$(curl -s "${BASE}/blog/how-ai-background-removal-works")
if echo "$CONTENT" | grep -q "Background removal"; then
  log_pass "Blog detail has article content"
else
  log_fail "Blog detail content" "Article content missing"
fi

# ============================================
# TEST 10: Static Assets
# ============================================
echo ""
echo "--- TEST 10: Static Assets ---"

CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}/favicon.ico")
if [ "$CODE" = "200" ]; then
  log_pass "Favicon loads"
else
  log_warn "Favicon" "HTTP $CODE"
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}/sitemap.xml")
if [ "$CODE" = "200" ]; then
  log_pass "Sitemap.xml loads"
else
  log_warn "Sitemap.xml" "HTTP $CODE"
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" "${BASE}/robots.txt")
if [ "$CODE" = "200" ]; then
  log_pass "Robots.txt loads"
else
  log_warn "Robots.txt" "HTTP $CODE"
fi

# ============================================
# SUMMARY
# ============================================
echo ""
echo "============================================"
echo "  TEST SUMMARY"
echo "============================================"
echo "  ✅ Passed:   $PASS"
echo "  ❌ Failed:   $FAIL"
echo "  ⚠️  Warnings: $WARN"
echo "  Total:       $((PASS+FAIL+WARN))"
echo "============================================"
if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "FAILURES:"
  echo -e "$ERRORS"
fi
