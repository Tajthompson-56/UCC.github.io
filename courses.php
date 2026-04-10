<?php
/**
 * courses.php
 * UCC IT Department PWA — Course Data Endpoint
 *
 * Called by app.js via fetch('courses.php')
 * Returns all courses as a JSON array.
 * Falls back to built-in data if the DB is unavailable.
 *
 * Authors: Marsha-Ann Genus (20233913) & Tajay Thompson (20205199)
 * Module:  ITT307 Internet Authoring II — Spring 2026
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: max-age=3600');

/* ── Database credentials ── */
$db_host     = 'localhost';
$db_user     = 'ucc_user';
$db_password = 'ucc2026';
$db_name     = 'ucc_it_app';

/* ── Built-in fallback data (used when DB is unavailable) ── */
$fallback = [
    ['id'=>1,  'code'=>'ITT101', 'name'=>'Introduction to Programming',      'description'=>'Fundamentals of programming using Python. Covers variables, control structures, functions, and basic data structures. Introduces computational thinking and problem-solving.',                                                              'prerequisite'=>'None',                 'credits'=>3, 'year'=>1, 'semester'=>1],
    ['id'=>2,  'code'=>'ITT102', 'name'=>'Computer Hardware & Architecture', 'description'=>'Introduction to computer organisation, digital logic, memory systems, CPU architecture, input/output devices, and basic assembly language concepts.',                                                                                        'prerequisite'=>'None',                 'credits'=>3, 'year'=>1, 'semester'=>1],
    ['id'=>3,  'code'=>'ITT103', 'name'=>'Mathematics for IT',               'description'=>'Discrete mathematics, logic, sets, functions, relations, graph theory, and probability relevant to computing problems and algorithm analysis.',                                                                                              'prerequisite'=>'None',                 'credits'=>3, 'year'=>1, 'semester'=>2],
    ['id'=>4,  'code'=>'ITT201', 'name'=>'Database Management Systems',      'description'=>'Relational database design, SQL, normalisation, and database administration. Practical work with MySQL and PostgreSQL. Introduction to NoSQL concepts.',                                                                                     'prerequisite'=>'ITT101',               'credits'=>3, 'year'=>2, 'semester'=>1],
    ['id'=>5,  'code'=>'ITT204', 'name'=>'Web Development I',                'description'=>'Client-side web technologies: HTML5, CSS3, and JavaScript. Responsive design principles, accessibility standards, and introduction to modern frameworks.',                                                                                  'prerequisite'=>'ITT101',               'credits'=>3, 'year'=>2, 'semester'=>1],
    ['id'=>6,  'code'=>'ITT207', 'name'=>'Computer Networks',                'description'=>'Network architectures, protocols, OSI model, TCP/IP stack. LAN/WAN configuration, routing, switching, and fundamentals of network security.',                                                                                               'prerequisite'=>'None',                 'credits'=>3, 'year'=>2, 'semester'=>2],
    ['id'=>7,  'code'=>'ITT301', 'name'=>'Software Engineering',             'description'=>'Software development lifecycle methodologies including Agile and Scrum. Requirements analysis, UML modelling, testing, and project management.',                                                                                             'prerequisite'=>'ITT201',               'credits'=>3, 'year'=>3, 'semester'=>1],
    ['id'=>8,  'code'=>'ITT304', 'name'=>'Web Development II',               'description'=>'Server-side development with PHP and Laravel framework. MVC architecture, REST API design, authentication, and deployment to cloud platforms.',                                                                                             'prerequisite'=>'ITT204',               'credits'=>3, 'year'=>3, 'semester'=>1],
    ['id'=>9,  'code'=>'ITT307', 'name'=>'Internet Authoring II',            'description'=>'Advanced internet technologies: Progressive Web Apps, service workers, offline storage, push notifications, and mobile-first development strategies.',                                                                                     'prerequisite'=>'ITT204',               'credits'=>3, 'year'=>3, 'semester'=>2],
    ['id'=>10, 'code'=>'ITT490', 'name'=>'Final Year Project',               'description'=>'A substantial independent research and development project supervised by a faculty member. Culminates in a written dissertation and live demonstration.',                                                                                   'prerequisite'=>'90 credits completed', 'credits'=>6, 'year'=>4, 'semester'=>1],
];

/* ── Try database first ── */
$conn = @new mysqli($db_host, $db_user, $db_password, $db_name);

if ($conn->connect_error) {
    /* DB unavailable — return fallback data */
    echo json_encode($fallback, JSON_PRETTY_PRINT);
    exit;
}

$result = $conn->query('SELECT id, code, name, description, prerequisite, credits, year, semester FROM courses ORDER BY year, semester, id ASC');

if (!$result || $result->num_rows === 0) {
    $conn->close();
    echo json_encode($fallback, JSON_PRETTY_PRINT);
    exit;
}

$courses = [];
while ($row = $result->fetch_assoc()) {
    $courses[] = [
        'id'          => (int) $row['id'],
        'code'        => $row['code'],
        'name'        => $row['name'],
        'description' => $row['description'],
        'prerequisite'=> $row['prerequisite'],
        'credits'     => (int) $row['credits'],
        'year'        => (int) $row['year'],
        'semester'    => (int) $row['semester'],
    ];
}

$conn->close();
echo json_encode($courses, JSON_PRETTY_PRINT);