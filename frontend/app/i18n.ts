import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLang =
  typeof window !== "undefined" ? localStorage.getItem("lang") : null;

i18n.use(initReactI18next).init({
  lng: savedLang ?? "fr",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: {
    fr: {
      translation: {
        home: "Accueil",
        login: "Se connecter",
        app_name: "EDUQCM",
        qcm: "QCM",
        teacher: "Enseignant",
        student: "Étudiant",
        go_to_dashboard: "Aller au tableau de bord",

        header: {
          quiz_platform: "Plateforme de QCM",
        },

        footer: {
          all_rights_reserved: "Tous droits réservés.",
          project_developed_by: "Projet développé par ",
        },

        menu: {
          dashboard: "Tableau de bord",
          qcm_management: "Gestion des QCM",
          assigned_qcm: "QCM assignés",
          results: "Résultats",
          users_management: "Gestion des utilisateurs",
          groups_management: "Gestion des groupes",
          settings: "Paramètres",
          logout: "Déconnexion",
          developped_by: "Développé par ",
        },

        home_page: {
          description: "Une plateforme simple pour gérer des QCM",
          pitch_part_1: "Crée, gère et assigne des ",
          pitch_part_2: " simplement.",
          description_long:
            "est une plateforme pensée pour les enseignants et les écoles : préparez des questionnaires en quelques minutes, lancez des sessions, récupérez des résultats clairs et gagnez du temps sur la correction.",
          get_started: "Commencer",
          discover_benefits: "Découvrir les avantages",
          fast: "Rapide",
          clear: "Clair",
          practical: "Pratique",
          create_quiz_in_minutes: "Créez des QCM en quelques minutes",
          readable_results: "Résultats lisibles",
          practical_for_revisions: "Idéal pour révisions & évaluations",
          examples_of_qcm: "Exemples de QCM",
          networks_basics: "Réseaux — Bases",
          maths_probabilities: "Maths — Probabilités",
          development_typescript: "Développement — TypeScript",
          what_you_gain: "Ce que vous gagnez",
          what_you_gain_description:
            "Une solution simple pour créer des évaluations, suivre les résultats et améliorer l’apprentissage — sans prise de tête.",
          centralization_of_qcm: "Centralisation des QCM",
          centralization_of_qcm_description:
            "Tous vos questionnaires au même endroit, plus besoin de fichiers dispersés.",
          easy_creation_maintenance: "Création & maintenance faciles",
          easy_creation_maintenance_description:
            "Ajoutez et modifiez questions/réponses rapidement, sans perdre le fil.",
          clear_results: "Résultats clairs",
          clear_results_description:
            "Consultez rapidement les scores et identifiez les points à renforcer.",
          time_saving: "Gain de temps",
          time_saving_description:
            "Moins de temps à corriger, plus de temps pour enseigner et accompagner.",
          for_teachers_and_students: "Pour enseignants & étudiants",
          for_teachers_and_students_description:
            "Une interface pensée pour préparer, passer et revoir les questionnaires.",
          solid_foundation_for_growth: "Base solide pour grandir",
          solid_foundation_for_growth_description:
            "Le projet est construit pour accueillir facilement de nouvelles fonctionnalités plus tard.",
          target_audience: "À qui s’adresse EDUQCM ?",
          target_audience_description:
            "création de QCM, évaluations, suivi des classes.",
          student_description: "révisions, entraînement, progression.",
          school: "Écoles / formations",
          school_description:
            "centraliser les questionnaires et les résultats.",
          how_does_it_work: "Comment ça marche ?",
          step_1: "Créez votre QCM (thèmes, questions, réponses).",
          step_2: "Lancez une session",
          step_3: "Les étudiants répondent facilement.",
          step_4: "Vous consultez les résultats et ajustez vos cours.",
          start_now: "Commencer maintenant",
        },

        login_page: {
          login: "Connexion",
          back_to_home: "Retour à l'accueil",
          login_to_your_space: "Connexion à votre espace",
          happy_to_see_you: "Content de te revoir 👋",
          description:
            "Connecte-toi pour accéder à tes QCM, les organiser et continuer ton travail dans un espace clair et centralisé.",
          quick_access: "Accès rapide",
          quick_access_description: "Reprends là où tu t’étais arrêté.",
          organization: "Organisation",
          organization_description: "Retrouve tes questionnaires facilement.",
          simplicity: "Simplicité",
          simplicity_description:
            "Une interface pensée pour aller droit au but.",
          form: {
            title: "EduQCM — Connexion",
            description: "Connecte-toi à ton compte",
            username: "Nom d'utilisateur",
            password: "Mot de passe",
            show_password: "Afficher",
            hide_password: "Masquer",
            connexion: "Se connecter",
            first_connection: "Première connexion ? ",
            create_account: "Crée un compte",
          },
        },

        register_page: {
          register: "Inscription",
          back_to_home: "Retour à l'accueil",
          create_account: "Créer un compte EDUQCM",
          welcome: "Bienvenue 👋",
          description:
            "Crée ton compte pour accéder à l’application et gérer tes QCM dans un espace clair et organisé.",
          simple: "Simple",
          simple_description: "Inscription rapide, sans prise de tête.",
          organized: "Organisé",
          organized_description:
            "Centralise tes questionnaires au même endroit.",
          practical: "Pratique",
          practical_description: "Accède facilement à tes contenus.",
          form: {
            title: "EduQCM — Inscription",
            description: "Crée ton compte",
            firstname: "Prénom",
            lastname: "Nom",
            username: "Nom d'utilisateur",
            password: "Mot de passe",
            confirm_password: "Confirmer le mot de passe",
            password_requirements: "Minimum 8 caractères.",
            show_password: "Afficher",
            hide_password: "Masquer",
            create_account: "Créer un compte",
            creating: "Création...",
            already_have_account: "Déjà un compte ? ",
            sign_in: "Se connecter",
          },
        },

        settings_page: {
          form: {
            title: "Paramètres",
            description: "Met à jour les informations de ton profil",
            firstname: "Prénom",
            lastname: "Nom",
            username: "Nom d'utilisateur",
            save: "Enregistrer",
            success: "Profil mis à jour avec succès.",
          },

          delete_account: {
            title: "Supprimer le compte",
            danger_zone: "Zone dangereuse",
            permanently_delete_account:
              "Supprime ton compte définitivement. Cette action est irréversible.",
            description:
              "Cela supprimera définitivement ton compte et toutes les données associées.\nEs-tu sûr de vouloir continuer ?",
            cancel: "Annuler",
            yes_delete: "Oui, supprimer",
            deleting: "Suppression...",
            delete_failed:
              "Échec de la suppression du compte. Veuillez réessayer.",
          },

          language: {
            title: "Changer de langue",
            description: "Sélectionne la langue de l'application",
            label: "Langue de l'application",
            hint: "Cela ne change que la langue de l'interface.",
            note: "Ta préférence est enregistrée automatiquement.",
          },
        },

        error_page: {
          reload: "Recharger",
          back_to_home: "Retour à l'accueil",
          something_went_wrong:
            "Si le problème persiste, l'API peut être temporairement indisponible.",
        },

        quiz_management: {
          page_title: "Gestion des QCM",
          create_qcm: "Créer un nouveau QCM",
          edit_qcm: "Modifier le QCM",
          view_qcm: "Voir le QCM",
          manage_topics: "Gérer les thematiques",
          delete_selected_qcm: "Supprimer les QCM sélectionnés",
          delete_selected_topics: "Supprimer les thématiques sélectionnées",
          columns: "Colonnes",
          label: "Label",
          topic: "Thématique",
          author: "Auteur",
          number_of_questions: "Nombre de questions",
          assignment_number: "Nombre d'assignements",
          view: "Voir",
          edit: "Modifier",
          delete: "Supprimer",
          actions: "Actions",
          no_results: "Aucun résultat trouvé.",
          previous: "Précédent",
          next: "Suivant",
          selected_rows: "{{count}} sur {{total}} lignes sélectionnées",
          enter_topic_label: "Entrez le label du topic",
          create: "Créer",
          save: "Enregistrer",
          cancel: "Annuler",
          label_required: "Le label est requis.",
          back_to_list: "← Retour à la liste des QCM",
          placeholder_label: "Entrez le label du QCM",
          placeholder_question: "Entrez le label de la question",
          placeholder_proposal: "Entrez la proposition {{index}}...",
          placeholder_topic: "Sélectionnez une thématique",
          question: "Question",
          add_question: "Ajouter une question",
          delete_question: "Supprimer la question",
          select_an_option: "Sélectionnez une option",
          error_loading_qcm: "Erreur lors du chargement du QCM :",
          deleted_topic: "Thématique supprimée avec succès.",
          topic_created_success: "Thématique créée avec succès.",
          failed_to_create_topic: "Échec de la création de la thématique.",
          topic_updated_success: "Thématique mise à jour avec succès.",
          failed_to_update_topic: "Échec de la mise à jour de la thématique.",
          deleted_selected_topics:
            "Thématiques sélectionnées supprimées avec succès.",
        },
      },
    },
    en: {
      translation: {
        home: "Home",
        login: "Sign in",
        app_name: "EDUQCM",
        qcm: "Quiz",
        teacher: "Teacher",
        student: "Student",
        go_to_dashboard: "Go to Dashboard",

        header: {
          quiz_platform: "Quiz Platform",
        },

        footer: {
          all_rights_reserved: "All rights reserved.",
          project_developed_by: "Project developed by ",
        },

        menu: {
          dashboard: "Dashboard",
          qcm_management: "QCM Management",
          assigned_qcm: "Assigned QCM",
          results: "Results",
          users_management: "Users Management",
          groups_management: "Groups Management",
          settings: "Settings",
          logout: "Logout",
          developped_by: "Developed by ",
        },

        home_page: {
          description: "A simple platform to manage quizzes",
          pitch_part_1: "Create, manage and assign ",
          pitch_part_2: " easily.",
          description_long:
            "is a platform designed for teachers and schools: prepare questionnaires in minutes, launch sessions, get clear results, and save time on grading.",
          get_started: "Get Started",
          discover_benefits: "Discover Benefits",
          fast: "Fast",
          clear: "Clear",
          practical: "Practical",
          create_quiz_in_minutes: "Create quizzes in minutes",
          readable_results: "Clear results",
          practical_for_revisions: "Ideal for revisions & assessments",
          examples_of_qcm: "Examples of quizzes",
          networks_basics: "Networks — Basics",
          maths_probabilities: "Maths — Probabilities",
          development_typescript: "Development — TypeScript",
          what_you_gain: "What you gain",
          what_you_gain_description:
            "A simple solution to create assessments, track results, and improve learning — hassle-free.",
          centralization_of_qcm: "Centralization of quizzes",
          all_your_quizzes_in_one_place:
            "All your questionnaires in one place, no more scattered files.",
          easy_creation_maintenance: "Easy creation & maintenance",
          easy_creation_maintenance_description:
            "Add and modify questions/answers quickly, without losing track.",
          clear_results: "Clear results",
          clear_results_description:
            "Quickly view scores and identify areas to improve.",
          time_saving: "Time saving",
          time_saving_description:
            "Less time grading, more time teaching and supporting.",
          for_teachers_and_students: "For teachers & students",
          for_teachers_and_students_description:
            "An interface designed to prepare, take, and review quizzes.",
          solid_foundation_for_growth: "Solid foundation for growth",
          solid_foundation_for_growth_description:
            "The project is built to easily accommodate new features later.",
          target_audience: "Who is EDUQCM for?",
          target_audience_description:
            "quiz creation, assessments, class tracking.",
          student_description: "revisions, practice, progress.",
          school: "Schools / training centers",
          school_description: "centralize questionnaires and results.",
          how_does_it_work: "How does it work?",
          step_1: "Create your quiz (themes, questions, answers).",
          step_2: "Launch a session",
          step_3: "Students answer easily.",
          step_4: "You review results and adjust your lessons.",
          start_now: "Start now",
        },

        login_page: {
          login: "Login",
          back_to_home: "Back to home",
          login_to_your_space: "Login to your space",
          happy_to_see_you: "Happy to see you 👋",
          description:
            "Log in to access your quizzes, organize them, and continue your work in a clear and centralized space.",
          quick_access: "Quick access",
          quick_access_description: "Pick up where you left off.",
          organization: "Organization",
          organization_description: "Easily find your questionnaires.",
          simplicity: "Simplicity",
          simplicity_description:
            "An interface designed to get straight to the point.",
          form: {
            title: "EduQCM — Login",
            description: "Log in to your account",
            username: "Username",
            password: "Password",
            show_password: "Show",
            hide_password: "Hide",
            connexion: "Sign in",
            first_connection: "First time here? ",
            create_account: "Create an account",
          },
        },

        register_page: {
          register: "Register",
          back_to_home: "Back to home",
          create_account: "Create an EDUQCM account",
          welcome: "Welcome 👋",
          description:
            "Create your account to access the application and manage your quizzes in a clear and organized space.",
          simple: "Simple",
          simple_description: "Quick registration, hassle-free.",
          organized: "Organized",
          organized_description: "Centralize your questionnaires in one place.",
          practical: "Practical",
          practical_description: "Easily access your content.",
          form: {
            title: "EduQCM — Register",
            description: "Create your account",
            firstname: "First name",
            lastname: "Last name",
            username: "Username",
            password: "Password",
            confirm_password: "Confirm password",
            password_requirements: "Minimum 8 characters.",
            show_password: "Show",
            hide_password: "Hide",
            create_account: "Create account",
            creating: "Creating...",
            already_have_account: "Already have an account? ",
            sign_in: "Sign in",
          },
        },

        settings_page: {
          form: {
            title: "Settings",
            description: "Update your profile information",
            firstname: "First name",
            lastname: "Last name",
            username: "Username",
            save: "Save",
            success: "Profile updated successfully.",
          },

          delete_account: {
            title: "Delete Account",
            danger_zone: "Danger Zone",
            permanently_delete_account:
              "Delete your account permanently. This action cannot be undone.",
            description:
              "This will permanently delete your account and all related data.\nAre you sure you want to continue?",
            cancel: "Cancel",
            yes_delete: "Yes, delete",
            deleting: "Deleting...",
            delete_failed: "Delete account failed. Please try again.",
          },

          language: {
            title: "Change Language",
            description: "Select the application language",
            label: "Application language",
            hint: "This only changes the interface language.",
            note: "Your preference is saved automatically.",
          },
        },

        error_page: {
          reload: "Reload",
          back_to_home: "Back to home",
          something_went_wrong:
            "If the problem persists, the API may be temporarily unavailable.",
        },

        quiz_management: {
          page_title: "Quiz Management",
          create_qcm: "Create a new QCM",
          edit_qcm: "Edit QCM",
          view_qcm: "View QCM",
          manage_topics: "Manage topics",
          delete_selected_qcm: "Delete selected QCMs",
          delete_selected_topics: "Delete selected topics",
          columns: "Columns",
          label: "Label",
          topic: "Topic",
          author: "Author",
          number_of_questions: "Number of questions",
          assignment_number: "Number of assignments",
          view: "View",
          edit: "Edit",
          delete: "Delete",
          actions: "Actions",
          no_results: "No results found.",
          previous: "Previous",
          next: "Next",
          selected_rows: "{{count}} out of {{total}} rows selected",
          enter_topic_label: "Enter topic label",
          create: "Create",
          modify: "Modify",
          save: "Save",
          cancel: "Cancel",
          label_required: "The label is required.",
          back_to_list: "← Back to QCM list",
          placeholder_label: "Enter the QCM label",
          placeholder_question: "Enter the question label",
          placeholder_proposal: "Enter proposal {{index}}...",
          placeholder_topic: "Select a topic",
          question: "Question",
          add_question: "Add a question",
          delete_question: "Delete the question",
          select_an_option: "Select an option",
          error_loading_qcm: "Error loading QCM:",
          deleted_topic: "Topic deleted successfully.",
          topic_created_success: "Topic created successfully.",
          failed_to_create_topic: "Failed to create topic.",
          topic_updated_success: "Topic updated successfully.",
          failed_to_update_topic: "Failed to update topic.",
        },
      },
    },
  },
});

export default i18n;
