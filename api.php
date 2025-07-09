<?php
// api.php
session_start(); // Start the session at the very beginning

require_once 'config.php'; // Include the database connection and table creation logic

// Set the content type to JSON
header('Content-Type: application/json');

// Helper function to send JSON response and exit
function sendJsonResponse($status, $message, $data = null) {
    echo json_encode(['status' => $status, 'message' => $message, 'data' => $data]);
    exit();
}

// Get the action from the request
$action = $_GET['action'] ?? $_POST['action'] ?? '';

// --- User Authentication Actions ---
if ($action === 'signup') {
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = $_POST['password'] ?? '';

    // Basic validation
    if (empty($username) || empty($email) || empty($password)) {
        sendJsonResponse('error', 'All fields are required.');
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        sendJsonResponse('error', 'Invalid email format.');
    }
    if (strlen($password) < 6) { // Minimum password length
        sendJsonResponse('error', 'Password must be at least 6 characters long.');
    }

    // Hash the password
    $password_hash = password_hash($password, PASSWORD_DEFAULT);

    try {
        // Check if username or email already exists
        $stmt = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->execute([$username, $email]);
        if ($stmt->fetch()) {
            sendJsonResponse('error', 'Username or Email already taken.');
        }

        // Insert new user
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)");
        $stmt->execute([$username, $email, $password_hash]);

        sendJsonResponse('success', 'Registration successful! You can now log in.');

    } catch (PDOException $e) {
        // Log the error for debugging, but send a generic message to the user
        error_log("Signup error: " . $e->getMessage());
        sendJsonResponse('error', 'An error occurred during registration. Please try again.');
    }

} elseif ($action === 'login') {
    $identifier = trim($_POST['identifier'] ?? ''); // Can be username or email
    $password = $_POST['password'] ?? '';

    if (empty($identifier) || empty($password)) {
        sendJsonResponse('error', 'Identifier and password are required.');
    }

    try {
        // Try to fetch user by email or username
        $stmt = $pdo->prepare("SELECT id, username, password_hash FROM users WHERE email = ? OR username = ?");
        $stmt->execute([$identifier, $identifier]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Authentication successful
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            sendJsonResponse('success', 'Login successful!', ['username' => $user['username']]);
        } else {
            // Authentication failed
            sendJsonResponse('error', 'Invalid credentials.');
        }

    } catch (PDOException $e) {
        error_log("Login error: " . $e->getMessage());
        sendJsonResponse('error', 'An error occurred during login. Please try again.');
    }

} elseif ($action === 'logout') {
    // Destroy the session
    session_unset();
    session_destroy();
    sendJsonResponse('success', 'Logged out successfully.');

} elseif ($action === 'get_username') {
    if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
        sendJsonResponse('success', 'Username fetched.', ['username' => $_SESSION['username']]);
    } else {
        // Use a 401 Unauthorized status code if not logged in
        http_response_code(401);
        sendJsonResponse('error', 'User not logged in or username not available.');
    }
}
// --- Notes Management Actions (Requires Authentication) ---
else {
    // All note actions require the user to be logged in
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401); // Send 401 Unauthorized status code
        sendJsonResponse('error', 'Unauthorized. Please log in.');
    }

    $user_id = $_SESSION['user_id'];

    if ($action === 'fetch_notes') {
        try {
            $stmt = $pdo->prepare("SELECT id, title, content, tags FROM notes WHERE user_id = ? ORDER BY created_at DESC");
            $stmt->execute([$user_id]);
            $notes = $stmt->fetchAll();

            // Prepare tags for frontend (split into array)
            foreach ($notes as &$note) {
                $note['tags'] = !empty($note['tags']) ? array_map('trim', explode(',', $note['tags'])) : [];
            }
            unset($note); // Unset reference

            sendJsonResponse('success', 'Notes fetched successfully.', $notes);
        } catch (PDOException $e) {
            error_log("Fetch notes error: " . $e->getMessage());
            sendJsonResponse('error', 'Failed to fetch notes.');
        }

    } elseif ($action === 'add_note') {
        $title = trim($_POST['title'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $tags = trim($_POST['tags'] ?? ''); // Stored as comma-separated string

        if (empty($title)) {
            sendJsonResponse('error', 'Note title cannot be empty.');
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO notes (user_id, title, content, tags) VALUES (?, ?, ?, ?)");
            $stmt->execute([$user_id, $title, $content, $tags]);
            $new_note_id = $pdo->lastInsertId();
            sendJsonResponse('success', 'Note added successfully.', ['id' => $new_note_id]);
        } catch (PDOException $e) {
            error_log("Add note error: " . $e->getMessage());
            sendJsonResponse('error', 'Failed to add note.');
        }

    } elseif ($action === 'update_note') {
        $note_id = $_POST['note_id'] ?? null;
        $title = trim($_POST['title'] ?? '');
        $content = trim($_POST['content'] ?? '');
        $tags = trim($_POST['tags'] ?? '');

        if (empty($note_id) || empty($title)) {
            sendJsonResponse('error', 'Note ID and title are required.');
        }

        try {
            // Ensure the user owns the note they are trying to update
            $stmt = $pdo->prepare("UPDATE notes SET title = ?, content = ?, tags = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?");
            $stmt->execute([$title, $content, $tags, $note_id, $user_id]);

            if ($stmt->rowCount() > 0) {
                sendJsonResponse('success', 'Note updated successfully.');
            } else {
                sendJsonResponse('error', 'Note not found or you do not have permission to edit it.');
            }
        } catch (PDOException $e) {
            error_log("Update note error: " . $e->getMessage());
            sendJsonResponse('error', 'Failed to update note.');
        }

    } elseif ($action === 'delete_note') {
        $note_id = $_POST['note_id'] ?? null;

        if (empty($note_id)) {
            sendJsonResponse('error', 'Note ID is required.');
        }

        try {
            // Ensure the user owns the note they are trying to delete
            $stmt = $pdo->prepare("DELETE FROM notes WHERE id = ? AND user_id = ?");
            $stmt->execute([$note_id, $user_id]);

            if ($stmt->rowCount() > 0) {
                sendJsonResponse('success', 'Note deleted successfully.');
            } else {
                sendJsonResponse('error', 'Note not found or you do not have permission to delete it.');
            }
        } catch (PDOException $e) {
            error_log("Delete note error: " . $e->getMessage());
            sendJsonResponse('error', 'Failed to delete note.');
        }

    } else {
        // If no valid action is provided
        sendJsonResponse('error', 'Invalid API action.');
    }
}
?>
