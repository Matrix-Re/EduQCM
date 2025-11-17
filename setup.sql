CREATE TABLE Utilisateur(
   IdUtilisateur INT NOT NULL AUTO_INCREMENT,
   Nom VARCHAR(100) NOT NULL,
   Prenom VARCHAR(100) NOT NULL,
   Login VARCHAR(100) NOT NULL,
   Password VARCHAR(255) NOT NULL,
   PRIMARY KEY(IdUtilisateur),
   UNIQUE(Login)
)
ENGINE = INNODB;

CREATE TABLE Eleve(
   IdUtilisateur INT,
   NbQCMRealises INT,
   MoyenneQCM FLOAT,
   PRIMARY KEY(IdUtilisateur),
   FOREIGN KEY(IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE Enseignant(
   IdUtilisateur INT,
   NbQCMCrees INT,
   PRIMARY KEY(IdUtilisateur),
   FOREIGN KEY(IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE Theme(
   IdTheme INT NOT NULL AUTO_INCREMENT,
   Description VARCHAR(50),
   PRIMARY KEY(IdTheme)
)
ENGINE = INNODB;

CREATE TABLE QCM(
   IdQCM INT NOT NULL AUTO_INCREMENT,
   LibelleQCM VARCHAR(100),
   IdAuteur INT NOT NULL,
   IdTheme INT NOT NULL,
   PRIMARY KEY(IdQCM),
   FOREIGN KEY(IdAuteur) REFERENCES Enseignant(IdUtilisateur) ON UPDATE CASCADE ON DELETE CASCADE,
   FOREIGN KEY(IdTheme) REFERENCES Theme(IdTheme)
)
ENGINE = INNODB;

CREATE TABLE Resultat(
   IdResultat INT NOT NULL AUTO_INCREMENT,
   DateAffectation DATE NOT NULL,
   DateRealisation DATE,
   Note FLOAT,
   IdQCM INT NOT NULL,
   IdUtilisateur INT NOT NULL,
   PRIMARY KEY(IdResultat),
   FOREIGN KEY(IdUtilisateur) REFERENCES Utilisateur(IdUtilisateur) ON UPDATE CASCADE ON DELETE CASCADE,
   FOREIGN KEY(IdQCM) REFERENCES QCM(IdQCM) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE Question(
   IdQuestion INT NOT NULL AUTO_INCREMENT,
   LibelleQuestion VARCHAR(100),
   TempsQuestion INT,
   IdQCM INT NOT NULL,
   PRIMARY KEY(IdQuestion),
   FOREIGN KEY(IdQCM) REFERENCES QCM(IdQCM) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE Proposition(
   IdProposition INT NOT NULL AUTO_INCREMENT,
   LibelleProposition VARCHAR(100),
   ResultatVraiFaux BOOLEAN,
   IdQuestion INT NOT NULL,
   PRIMARY KEY(IdProposition),
   FOREIGN KEY(IdQuestion) REFERENCES Question(IdQuestion) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

CREATE TABLE Reponse(
   IdResultat INT NOT NULL,
   IdProposition INT,
   ReponseEleve FLOAT,
   PRIMARY KEY(IdResultat, IdProposition),
   FOREIGN KEY(IdResultat) REFERENCES Resultat(IdResultat) ON UPDATE CASCADE ON DELETE CASCADE,
   FOREIGN KEY(IdProposition) REFERENCES Proposition(IdProposition) ON UPDATE CASCADE ON DELETE CASCADE
)
ENGINE = INNODB;

-- Creation d'un trigger qui met à jour la moyen QCM à chaque mise à jour de la table resultat

DELIMITER //
CREATE TRIGGER SetMoyenneQCM AFTER UPDATE ON Resultat
FOR EACH ROW
BEGIN
	UPDATE eleve
	SET MoyenneQCM = (
		SELECT ROUND(AVG(Note) * 100) / 100
		FROM Resultat
		WHERE Resultat.IdUtilisateur = eleve.IdUtilisateur
	);
END //
DELIMITER ;