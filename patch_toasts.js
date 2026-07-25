const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/app/(dashboard)');

// Each entry: { file, insertions: [{afterLine, code}] }
// afterLine is the exact line content to insert after (trimmed)
const edits = [
  {
    file: 'patients/page.tsx',
    insertions: [
      { after: "setPatients([newPatient, ...patients]);", before: "setIsModalOpen(false);", insert: "    toast.success('Patient added successfully!');" }
    ]
  },
  {
    file: 'doctors/page.tsx',
    insertions: [
      { after: "setDoctors([newDoctor, ...doctors]);", before: "setIsModalOpen(false);", insert: "    toast.success('Doctor added successfully!');" }
    ]
  },
  {
    file: 'appointments/page.tsx',
    insertions: [
      { after: "setAppointments([newApt, ...appointments]);", before: "setIsModalOpen(false);", insert: "    toast.success('Appointment scheduled successfully!');" }
    ]
  },
  {
    file: 'nurses-staff/page.tsx',
    insertions: [
      { after: "setStaff([newStaff, ...staff]);", before: "setIsModalOpen(false);", insert: "    toast.success('Staff member added successfully!');" }
    ]
  },
  {
    file: 'laboratory/page.tsx',
    insertions: [
      { after: "setTests([newTest, ...tests]);", before: "setIsModalOpen(false);", insert: "    toast.success('Lab test request added successfully!');" }
    ]
  },
  {
    file: 'emergency/page.tsx',
    insertions: [
      { after: "setCases([newCase, ...cases]);", before: "setIsModalOpen(false);", insert: "    toast.success('Emergency case registered!');" }
    ]
  },
  {
    file: 'blood-bank/page.tsx',
    insertions: [
      { after: "setIsModalOpen(false);", before: null, insert: "    toast.success('Blood donation recorded successfully!');" }
    ]
  },
  {
    file: 'bed-management/page.tsx',
    insertions: [
      { after: "setBeds([...beds, newBed]);", before: "setIsModalOpen(false);", insert: "    toast.success('Bed added successfully!');" }
    ]
  },
  {
    file: 'ambulance/page.tsx',
    insertions: [
      { after: "setAmbulances([newAmb, ...ambulances]);", before: "setIsModalOpen(false);", insert: "    toast.success('Ambulance added successfully!');" }
    ]
  },
  {
    file: 'settings/page.tsx',
    insertions: [
      { after: "setSavedSection(section);", before: "setTimeout(() => setSavedSection(null), 3000);", insert: "      toast.success('Settings saved successfully!');" }
    ]
  },
];

for (const { file, insertions } of edits) {
  const filePath = path.join(dir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP (not found): ${file}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  for (const { after, before, insert } of insertions) {
    // Already done?
    if (content.includes(insert.trim())) {
      console.log(`SKIP (already patched): ${file} -> ${insert.trim()}`);
      continue;
    }

    // Normalize line endings to \n for processing
    const lines = content.replace(/\r\n/g, '\n').split('\n');
    let insertIndex = -1;

    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (trimmed === after.trim()) {
        // If before is specified, find that line right after
        if (before) {
          if (i + 1 < lines.length && lines[i + 1].trim() === before.trim()) {
            insertIndex = i + 1; // insert before the 'before' line
            break;
          }
        } else {
          insertIndex = i + 1; // insert after this line
          break;
        }
      }
    }

    if (insertIndex === -1) {
      console.log(`NOT FOUND: ${file} -> after: "${after}"`);
      continue;
    }

    lines.splice(insertIndex, 0, insert);
    content = lines.join('\r\n'); // restore Windows line endings
    changed = true;
    console.log(`PATCHED: ${file} -> ${insert.trim()}`);
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
  }
}

console.log('Done!');
