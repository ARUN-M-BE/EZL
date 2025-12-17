

const BASE_URL = 'http://localhost:3001/api';
let token = '';
let userId = '';
let instructorId = '';

async function runTests() {
    console.log('--- Starting Backend Verification ---');

    // 1. Register User (Instructor)
    console.log('\n1. Registering an Instructor...');
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Instructor',
                email: `instructor_${Date.now()}@test.com`,
                password: 'password123',
                role: 'instructor',
                location: 'Sydney',
                vehicle: 'Auto',
                price: 80,
                bio: 'Test bio',
                image: 'http://example.com/img.jpg'
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Instructor Registered:', data.user.id);
            instructorId = data.user.id;
        } else {
            console.error('❌ Failed to register instructor:', data);
        }
    } catch (e) { console.error('❌ Error:', e.message); }

    // 2. Register User (Learner)
    console.log('\n2. Registering a Learner...');
    try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Learner',
                email: `learner_${Date.now()}@test.com`,
                password: 'password123',
                role: 'learner'
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Learner Registered:', data.user.id);
            userId = data.user.id;
            token = data.token; // Keep learner token
        } else {
            console.error('❌ Failed to register learner:', data);
        }
    } catch (e) { console.error('❌ Error:', e.message); }

    // 3. Fetch Instructors
    console.log('\n3. Fetching Instructors...');
    try {
        const res = await fetch(`${BASE_URL}/instructors`);
        const data = await res.json();
        if (res.ok && Array.isArray(data)) {
            console.log(`✅ Fetched ${data.length} instructors.`);
        } else {
            console.error('❌ Failed to fetch instructors:', data);
        }
    } catch (e) { console.error('❌ Error:', e.message); }

    // 4. Create Booking
    console.log('\n4. Creating Booking...');
    try {
        const res = await fetch(`${BASE_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // If auth middleware added later
            },
            body: JSON.stringify({
                learner_id: userId,
                instructor_id: instructorId,
                date: '2024-12-25',
                package_id: 'p1'
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Booking Created:', data.id);
        } else {
            console.error('❌ Failed to create booking:', data);
        }
    } catch (e) { console.error('❌ Error:', e.message); }

    // 5. Test Prompt
    console.log('\n5. Saving Prompt...');
    try {
        const res = await fetch(`${BASE_URL}/prompts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                user_id: userId,
                command: 'Hello',
                response: 'Hi there!'
            })
        });
        const data = await res.json();
        if (res.ok) {
            console.log('✅ Prompt Saved:', data.id);
        } else {
            console.error('❌ Failed to save prompt:', data);
        }
    } catch (e) { console.error('❌ Error:', e.message); }

    console.log('\n--- Verification Complete ---');
}

// Check if server is up before running
setTimeout(runTests, 2000);
