import { type JwtPayload, jwtDecode } from 'jwt-decode';

interface ExtendedJwt extends JwtPayload {
  data: {
    username: string;
    email: string;
    id: string;  // changed _id to id per your new version
  };
}

class AuthService {
  // Decodes the JWT token to get user info
  getProfile(): ExtendedJwt | null {
    const token = this.getToken();
    if (!token || this.isTokenExpired(token)) {
      this.logout();
      return null;
    }
    try {
      return jwtDecode<ExtendedJwt>(token);
    } catch (err) {
      console.error('Failed to decode token:', err);
      this.logout();
      return null;
    }
  }

  // Check if user is logged in (valid, non-expired token)
  loggedIn(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // Check if token is expired
  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return !!decoded?.exp && decoded.exp < Date.now() / 1000;
    } catch (err) {
      console.warn('Invalid token detected:', err);
      return true; // Treat error as expired token
    }
  }

  // Get token from localStorage
  getToken(): string {
    return localStorage.getItem('id_token') || '';
  }

  // Save token to localStorage
  login(idToken: string): void {
    localStorage.setItem('id_token', idToken);
    // Redirect should be handled by component calling this method
  }

  // Remove token and redirect to login page
  logout(): void {
    localStorage.removeItem('id_token');
    window.location.assign('/login');
  }
}

export default new AuthService();
