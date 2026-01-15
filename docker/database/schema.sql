CREATE TABLE user(
    id INT NOT NULL AUTO_INCREMENT,
    lastname VARCHAR(100) NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255),
    refresh_token_expires_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    UNIQUE(username)
)
ENGINE = INNODB;

CREATE TABLE student(
    id INT NOT NULL,
    completed_qcm_count INT DEFAULT 0,
    average_qcm_score FLOAT DEFAULT 0,
    PRIMARY KEY(id),
    FOREIGN KEY(id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE teacher (
    id INT NOT NULL,
    created_qcm_count INT DEFAULT 0,
    PRIMARY KEY(id),
    FOREIGN KEY(id) REFERENCES user(id) ON UPDATE CASCADE ON DELETE CASCADE
)
    ENGINE = INNODB;

CREATE TABLE topic(
    id INT NOT NULL AUTO_INCREMENT,
    label VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id)
)
ENGINE = INNODB;

CREATE TABLE qcm(
    id INT NOT NULL AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    time_limit INT,
    author_id INT NOT NULL,
    topic_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(author_id) REFERENCES teacher(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(topic_id) REFERENCES topic(id)
)
ENGINE = INNODB;

CREATE TABLE session(
    id INT NOT NULL AUTO_INCREMENT,
    assignment_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completion_date DATETIME DEFAULT NULL,
    expires_at DATETIME DEFAULT NULL,
    status ENUM('assigned', 'started', 'completed', 'abandoned') NOT NULL DEFAULT 'started',
    score FLOAT,
    qcm_id INT NOT NULL,
    student_id INT NOT NULL,
    PRIMARY KEY(id),
    FOREIGN KEY(student_id) REFERENCES student(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(qcm_id) REFERENCES qcm(id) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE question(
    id INT NOT NULL AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    qcm_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(qcm_id) REFERENCES qcm(id) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE proposal(
    id INT NOT NULL AUTO_INCREMENT,
    label VARCHAR(100) NOT NULL,
    is_correct BOOLEAN,
    question_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY(question_id) REFERENCES question(id) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE answer(
    session_id INT NOT NULL,
    proposal_id INT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY(session_id, proposal_id),
    FOREIGN KEY(session_id) REFERENCES session(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(proposal_id) REFERENCES proposal(id) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

-- Creation d'un trigger qui met à jour la moyen QCM à chaque mise à jour de la table session

DELIMITER //
CREATE TRIGGER update_average_qcm_score AFTER UPDATE ON session
    FOR EACH ROW
BEGIN
    UPDATE student
    SET average_qcm_score = (
        SELECT ROUND(AVG(score) * 100) / 100
        FROM session
        WHERE session.user_id = student.id
    ), completed_qcm_count = (
        SELECT COUNT(*)
        FROM session
        WHERE session.user_id = student.id AND session.completion_date IS NOT NULL
    )
    WHERE student.id = NEW.user_id;
END //
DELIMITER ;