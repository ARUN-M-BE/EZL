
// Native fetch used

// Helper
const log = (msg) => console.log(msg);
const err = (msg) => console.log('❌ ' + msg);
const success = (msg) => console.log('✅ ' + msg);

const BASE_URL = 'http://localhost:3001/api';
let learnerId = '';
let instructorId = '';
let bookingId = '';

async function run() {
    log('--- Starting Full Stack Verification ---');

    // 1. Create Users
    try {
        const iRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Instructor', email: `inst_${Date.now()}@test.com`, password: '123', role: 'instructor' })
        });
        const iData = await iRes.json();
        if (!iRes.ok) {
            err(`Instructor Reg Failed: ${iRes.status} ${JSON.stringify(iData)}`);
            return;
        }
        instructorId = iData.user.id;
        success(`Registered Instructor: ${instructorId}`);

        const lRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Test Learner', email: `learn_${Date.now()}@test.com`, password: '123', role: 'learner' })
        });
        const lData = await lRes.json();
        if (!lRes.ok) {
            err(`Learner Reg Failed: ${lRes.status} ${JSON.stringify(lData)}`);
            return;
        }
        learnerId = lData.user.id;
        success(`Registered Learner: ${learnerId}`);

    } catch (e) { err('Registration failed: ' + e.message); return; }

    // 2. Update Profiles
    try {
        const upRes = await fetch(`${BASE_URL}/users/${instructorId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ bio: 'Updated Bio', languages: 'English, French', price: 90 })
        });
        if (upRes.ok) success('Instructor Profile Update OK');
        else err('Instructor Profile Update Failed: ' + upRes.status);

        const checkRes = await fetch(`${BASE_URL}/instructors/${instructorId}`);
        const checkData = await checkRes.json();
        if (checkData.languages === 'English, French') success('Instructor Profile persisted');
        else err('Instructor Profile persistence failed');

        const upLRes = await fetch(`${BASE_URL}/users/${learnerId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: '123 Test St', transmission_preference: 'Manual' })
        });
        if (upLRes.ok) success('Learner Profile Update OK');

    } catch (e) { err('Profile Update failed: ' + e.message); }

    // 3. Create Booking & Review
    try {
        const bRes = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ learner_id: learnerId, instructor_id: instructorId, date: new Date().toISOString(), package_id: 'pkg_1' })
        });
        const bData = await bRes.json();
        if (!bRes.ok) { err('Booking Failed'); return; }
        bookingId = bData.id;
        success(`Booking Created: ${bookingId}`);

        const rRes = await fetch(`${BASE_URL}/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ booking_id: bookingId, instructor_id: instructorId, learner_id: learnerId, rating: 5, comment: 'Great lesson!' })
        });
        if (rRes.ok) success('Review Created');

        const reviewsRes = await fetch(`${BASE_URL}/instructors/${instructorId}/reviews`);
        const reviews = await reviewsRes.json();
        if (reviews.length > 0 && reviews[0].comment === 'Great lesson!') success('Review Fetched correctly');
        else err('Review Fetch failed or empty');

    } catch (e) { err('Booking/Review failed: ' + e.message); }

    // 4. Update Progress
    try {
        const pRes = await fetch(`${BASE_URL}/progress`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ learner_id: learnerId, skill: 'Parking', percentage: 50 })
        });
        if (pRes.ok) success('Progress Updated');

        const getPRes = await fetch(`${BASE_URL}/progress/${learnerId}`);
        const pData = await getPRes.json();
        const parking = pData.find(p => p.skill === 'Parking');
        if (parking && parking.percentage === 50) success('Progress Persisted');
        else err('Progress verification failed');

    } catch (e) { err('Progress failed: ' + e.message); }

    log('--- Verification Complete ---');
}

run();
