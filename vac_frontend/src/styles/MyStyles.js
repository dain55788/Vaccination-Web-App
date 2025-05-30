import { StyleSheet, Dimensions, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
  primary: '#2a6df4',
  secondary: '#4CAF50',
  accent: '#FFC107',
  danger: '#FF5252',
  success: '#4CAF50',
  warning: '#FFC107',
  info: '#2196F3',
  light: '#f8f9fa',
  dark: '#333333',
  black: '#000000',
  white: '#FFFFFF',
  gray: '#666666',
  lightGray: '#f0f0f0',
  mediumGray: '#999999',
  teal: '#26A69A',
  grey: '#BDBDBD',
  border: '#eee',
  text: {
    primary: '#333333',
    secondary: '#666666',
    light: '#FFFFFF',
    muted: '#999999',
  },
  background: {
    primary: '#FFFFFF',
    secondary: '#f8f9fa',
  },
  status: {
    completed: '#4CAF50',
    pending: '#FFC107',
    incomplete: '#FF5252',
  }
};

const FONT_SIZE = {
  tiny: 10,
  small: 12,
  regular: 14,
  medium: 16,
  large: 18,
  extraLarge: 20,
  huge: 24,
  enormous: 30,
};

const SPACING = {
  tiny: 4,
  small: 8,
  regular: 12,
  medium: 16,
  large: 20,
  extraLarge: 24,
  huge: 32,
  enormous: 40,
};

const BORDER_RADIUS = {
  small: 4,
  regular: 8,
  medium: 12,
  large: 16,
  round: 50,
};

const SHADOW = {
  light: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
};

export const commonStyles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    zIndex: 1,
  },
  textInput: {
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.background.primary,
  },
  backButton: {
    marginRight: SPACING.medium,
  },
  backButtonText: {
    fontSize: FONT_SIZE.extraLarge,
    color: COLORS.primary,
  },
  closeButton: {
    fontSize: FONT_SIZE.extraLarge,
    color: COLORS.text.secondary,
  },
  chatOptionsModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.large,
  },
  chatOptionsModal: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.large,
    width: '100%',
    maxWidth: 400,
    ...SHADOW.dark,
  },
  chatOptionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.large,
  },
  chatOptionsTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  chatOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.medium,
    backgroundColor: COLORS.background.secondary,
  },
  chatOptionContent: {
    marginLeft: SPACING.medium,
    flex: 1,
  },
  chatOptionTitle: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SPACING.tiny,
  },
  chatOptionDescription: {
    fontSize: FONT_SIZE.small,
    color: COLORS.text.secondary,
  },
  scrollContainer: {
    flex: 1,
    position: 'relative',
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  chatModal: {
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: BORDER_RADIUS.medium,
    borderTopRightRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    height: '80%',
    ...SHADOW.dark,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.medium,
  },
  chatTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  messagesContainer: {
    padding: SPACING.small,
  },
  message: {
    maxWidth: '75%',
    padding: SPACING.small,
    borderRadius: BORDER_RADIUS.small,
    marginBottom: SPACING.small,
  },
  userMessage: {
    backgroundColor: COLORS.primary,
    alignSelf: 'flex-end',
  },
  geminiMessage: {
    backgroundColor: COLORS.background.secondary,
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: FONT_SIZE.medium,
  },
  userMessageText: {
    color: COLORS.white,
  },
  geminiMessageText: {
    color: COLORS.text.primary,
  },
  inputView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.small,
    backgroundColor: COLORS.background.secondary,
    borderRadius: BORDER_RADIUS.medium,
    marginTop: SPACING.medium,
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.small,
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  sendButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    marginLeft: SPACING.tiny,
    shadowColor: COLORS.primary,
    marginRight: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZE.medium,
  },
  largerChatButton: {
    width: 60,
    height: 60,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpLabelContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helpLabel: {
    fontSize: FONT_SIZE.large,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.medium,
  },
  loginButton: {
    marginTop: SPACING.medium,
    marginBottom: SPACING.medium,
    borderRadius: BORDER_RADIUS.small,
  },
  loginButtonContent: {
    paddingVertical: SPACING.small,
    fontSize: FONT_SIZE.enormous,
  },
  footer: {
    padding: SPACING.medium,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  footerSection: {
    width: '30%',
    minWidth: 160,
    marginBottom: SPACING.large,
  },
  footerHeading: {
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.medium,
  },
  footerLink: {
    marginBottom: SPACING.small,
  },
  footerLinkText: {
    color: COLORS.lightGray,
    fontSize: FONT_SIZE.small,
  },
  footerText: {
    color: COLORS.lightGray,
    fontSize: FONT_SIZE.small,
    marginBottom: SPACING.small,
  },
  formLabel: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.primary,
    fontWeight: '500',
    marginBottom: SPACING.small,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    margin: SPACING.large,
    padding: SPACING.large,
    borderRadius: 12,
    elevation: 5,
    width: '90%',
    maxHeight: '150%',
  },
  vaccineDoseQuantity: {  
    color: COLORS.danger,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    fontSize: 16,
    backgroundColor: COLORS.white,
  },
  chatContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: "#fff",
  },
  chatButtonContainer: {
    position: 'absolute',
    bottom: SPACING.large,
    right: SPACING.large,
    zIndex: 1000,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
    height: 70,
    width: 70,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: .9,
    shadowRadius: 8,
    marginRight: 20,
    marginBottom: 50,
  },
  dateButton: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
  },
  dateButtonText: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.primary,
  },
  formCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.large,
    borderTopRightRadius: BORDER_RADIUS.large,
    borderBottomLeftRadius: BORDER_RADIUS.large,
    borderBottomRightRadius: BORDER_RADIUS.large,
    margin: SPACING.medium,
    marginTop: SPACING.extraLarge,
    padding: SPACING.large,
    ...SHADOW.medium,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.medium,
  },
  section: {
    marginBottom: SPACING.large,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.huge,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.medium,
  },
  vaccineText: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.primary,
  },
  optionButton: {
    paddingVertical: SPACING.small,
    paddingHorizontal: SPACING.medium,
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.small,
    marginRight: SPACING.small,
    marginBottom: SPACING.small,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputContainer: {
    marginBottom: SPACING.small,
  },
  optionsContainer: {
    flexDirection: 'column',
  },
  selectedOption: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  selectedOptionText: {
    color: COLORS.white,
    fontWeight: '400',
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.secondary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padding: {
    padding: SPACING.medium,
  },
  paddingHorizontal: {
    paddingHorizontal: SPACING.medium,
  },
  paddingVertical: {
    paddingVertical: SPACING.medium,
  },
  margin: {
    margin: SPACING.medium,
  },
  marginHorizontal: {
    marginHorizontal: SPACING.medium,
  },
  marginVertical: {
    marginVertical: SPACING.medium,
  },
  marginBottom: {
    marginBottom: SPACING.medium,
  },
  marginTop: {
    marginTop: SPACING.medium,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 50
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.medium,
    ...SHADOW.medium,
  },
  registerButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    fontWeight: 'bold',
  },
  campaignRegisterButton: {
    marginTop: SPACING.medium,
    marginHorizontal: 0,
  },
  registerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  registerIcon: {
    marginRight: SPACING.small,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    textAlign: 'center',
    paddingHorizontal: SPACING.medium,
    paddingVertical: SPACING.regular,
    backgroundColor: COLORS.background.primary,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerSubtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.white,
    opacity: 1,
    textAlign: 'center',
  },
  content: {
    padding: SPACING.medium,
  },
  scrollViewContent: {
    padding: SPACING.medium,
  },
  card: {
    backgroundColor: COLORS.background.primary,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.medium,
    marginBottom: SPACING.medium,
    ...SHADOW.medium,
  },
  cardTitle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontSize: FONT_SIZE.large,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.regular,
  },
  title: {
    fontSize: FONT_SIZE.extraLarge,
    fontWeight: 'bold',
    color: COLORS.text.primary,
  },
  subtitle: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.text.secondary,
    marginTop: SPACING.tiny,
  },
  text: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  formContainer: {
    marginBottom: SPACING.medium,
  },
  input: {
    backgroundColor: COLORS.background.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.regular,
    padding: SPACING.tiny,
    marginVertical: SPACING.small,
    fontSize: FONT_SIZE.regular,
  },
  label: {
    fontSize: FONT_SIZE.regular,
    color: COLORS.primary,
    marginBottom: SPACING.tiny,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: FONT_SIZE.medium,
    marginTop: SPACING.tiny,
    marginBottom: SPACING.small,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  successText: {
    color: COLORS.success,
    fontSize: FONT_SIZE.medium,
    marginTop: SPACING.tiny,
    marginBottom: SPACING.tiny,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.small,
    padding: SPACING.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.small,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    fontWeight: '500',
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  buttonOutlineText: {
    color: COLORS.primary,
  },
  buttonDisabled: {
    backgroundColor: COLORS.lightGray,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.lightGray,
    marginVertical: SPACING.medium,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: BORDER_RADIUS.round,
  },
  imageContainer: {
    marginBottom: SPACING.small,
    marginVertical: SPACING.huge,
  },
  image: {
    height: 200,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: BORDER_RADIUS.medium,
    ...SHADOW.medium,
  },
  imagePlaceholder: {
    height: 200,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOW.medium,
  },
  imageButton: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.medium,
    borderRadius: BORDER_RADIUS.regular,
    alignItems: 'center',
    marginVertical: SPACING.small,
    ...SHADOW.light,
  },
  imageButtonText: {
    color: COLORS.text.primary,
    fontSize: FONT_SIZE.regular,
  },
  completed: {
    color: COLORS.status.completed,
  },
  pending: {
    color: COLORS.status.pending,
  },
  incomplete: {
    color: COLORS.status.incomplete,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },

  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.small,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  badge: {
    paddingHorizontal: SPACING.small,
    paddingVertical: SPACING.tiny,
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.tiny,
    fontWeight: 'bold',
  },
});

export const responsive = {
  isSmallDevice: width < 375,
  isMediumDevice: width >= 375 && width < 768,
  isLargeDevice: width >= 768,
  isIOS: Platform.OS === 'ios',
  isAndroid: Platform.OS === 'android',
};

export {
  COLORS,
  FONT_SIZE,
  SPACING,
  BORDER_RADIUS,
  SHADOW
};

export default commonStyles;
