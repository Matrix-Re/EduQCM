import { Button } from "~/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import {useState} from "react";
import {useAuthStore} from "~/store/auth";
import {useNavigate} from "react-router";
import {register} from "~/api/auth";

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const setAuth = useAuthStore((state) => state.setAuth);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      setError(null)
      const form = e.currentTarget
      const fd = new FormData(form)
      const payload = {
        firstname: String(fd.get("firstname") ?? ""),
        lastname: String(fd.get("lastname") ?? ""),
        username: String(fd.get("username") ?? ""),
        password: String(fd.get("password") ?? ""),
        confirm_password: String(fd.get("confirm-password") ?? ""),
      }

      // Check if all fields are filled
      if (!payload.firstname || !payload.lastname || !payload.username || !payload.password || !payload.confirm_password) {
          setError("Please fill in all fields")
          return
      }

      // Check if password and confirm password match
      if (payload.password !== payload.confirm_password) {
          setError("Passwords do not match")
          return
      }

      setLoading(true)
      try {
        const data = await register(
            payload.firstname,
            payload.lastname,
            payload.username,
            payload.password,
            "student"
        );

        setAuth({ ...data.user, role: data.role }, data.token);
        navigate("/dashboard");
      } catch (err) {
        setError(String(err))
      } finally {
        setLoading(false)
      }
    }

    return (
        <Card {...props}>
          <CardHeader>
            <CardTitle>EduQCM</CardTitle>
            <CardDescription>
              Enter your information below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="name">Firstname</FieldLabel>
                  <Input name="firstname" type="text" placeholder="John Doe" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="email">Lastname</FieldLabel>
                  <Input name="lastname" type="text" placeholder="m@example.com" required/>
                </Field>
                <Field>
                  <FieldLabel htmlFor="name">Username</FieldLabel>
                  <Input name="username" type="text" placeholder="John Doe" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input name="password" type="password" required />
                  <FieldDescription className="text-[var(--error)]">
                    Must be at least 8 characters long.
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input name="confirm-password" type="password" required />
                  <FieldDescription>Please confirm your password.</FieldDescription>
                </Field>
                <FieldGroup>
                  <Field>
                    <Button type="submit" className="button-primary">Create Account</Button>
                    <FieldDescription className="px-6 text-center">
                      Already have an account? <a href="login">Sign in</a>
                    </FieldDescription>
                    {error && <div className="text-red-500 mt-2">{error}</div>}
                  </Field>
                </FieldGroup>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
    )
}
