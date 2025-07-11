<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$servername = "localhost";
$username = "your_username";
$password = "your_password";
$dbname = "st_gabriel_chaplaincy";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Connection failed: ' . $conn->connect_error]));
}

// Create table if not exists
$createTable = "CREATE TABLE IF NOT EXISTS members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id VARCHAR(20) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email_address VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender VARCHAR(10),
    ministry VARCHAR(100),
    sacrament_status VARCHAR(50),
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    photo_path VARCHAR(500)
)";

$conn->query($createTable);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Handle registration
    $input = json_decode(file_get_contents('php://input'), true);
    
    $member_id = 'SGC-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
    $full_name = $conn->real_escape_string($input['fullName']);
    $email = $conn->real_escape_string($input['emailAddress']);
    $phone = $conn->real_escape_string($input['phoneNumber']);
    $ministry = $conn->real_escape_string($input['ministry']);
    $sacrament_status = $conn->real_escape_string($input['sacramentStatus']);
    
    $sql = "INSERT INTO members (member_id, full_name, email_address, phone_number, ministry, sacrament_status) 
            VALUES ('$member_id', '$full_name', '$email', '$phone', '$ministry', '$sacrament_status')";
    
    if ($conn->query($sql) === TRUE) {
        echo json_encode([
            'success' => true, 
            'message' => 'Registration successful!',
            'member_id' => $member_id
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error: ' . $conn->error]);
    }
    
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Handle data retrieval
    $sql = "SELECT * FROM members ORDER BY registration_date DESC";
    $result = $conn->query($sql);
    
    $members = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $members[] = $row;
        }
    }
    
    echo json_encode(['success' => true, 'data' => $members]);
}

$conn->close();
?>
