import pandas as pd
import re
import copy
import sys

class_columns = ['科目区分', 'コース', '科目コード', '分類', '科目名', '単位数']


class User:
    course = None
    determine_course = None
    class_codes = []

    def __init__(self, course: str, determine_course: str, class_codes: str):
        self.course = course
        self.determine_course = determine_course
        self.class_codes = list(class_codes.split(','))


class Determiner:
    user = None
    requirements = None
    user_results = None

    def __init__(self):
        self.classes_df = pd.ExcelFile('lectures.xlsx').parse('授業情報')
        self.rules_df = pd.ExcelFile('rules.xlsx').parse('修了要件')

    def pick_classes_of_division(self, in_classes, division: str, user: User, course: str):
        classes = copy.deepcopy(in_classes)
        #course = user.course
        #print(classes, division)
        if division == '-':
            if course == 'コース標準課程':
                classes = classes[classes['コース'] == user.course]
            pass
        elif re.search('^文系教養科目', division):
            classes = classes[classes['科目区分'] == '文系教養科目']
            if division == '文系教養科目400番台':
                classes = classes[classes['科目コード'].str.contains('.....4.*')]
            elif division == '文系教養科目500番台':
                classes = classes[classes['科目コード'].str.contains('.....5.*')]
            elif division == '文系教養科目600番台':
                classes = classes[classes['科目コード'].str.contains('.....6.*')]
        elif re.search('^キャリア科目', division):
            # print(pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
            classes = classes[classes['科目区分'] == 'キャリア科目']
            classes = classes[(classes['コース'].isnull()) |
                              (classes['コース'] == user.course)]
            if division == 'キャリア科目C0M':
                # print(pd.concat([classes['科目コード'],classes['分類']],axis=1))
                classes = classes[classes['分類'].str.contains('C0M')]
            elif division == 'キャリア科目C1M':
                classes = classes[classes['分類'].str.contains('C1M')]
            elif division == 'キャリア科目A0M':
                classes = classes[classes['分類'].str.contains('A0M')]
            elif division == 'キャリア科目A1M':
                classes = classes[classes['分類'].str.contains('A1M')]
            elif division == 'キャリア科目A2M':
                classes = classes[classes['分類'].str.contains('A2M')]
            elif division == 'キャリア科目A3M':
                classes = classes[classes['分類'].str.contains('A3M')]
            elif division == 'キャリア科目P0M':
                classes = classes[classes['分類'].str.contains('P0M')]
            elif division == 'キャリア科目P1M':
                classes = classes[classes['分類'].str.contains('P1M')]
            elif division == 'キャリア科目P2M':
                classes = classes[classes['分類'].str.contains('P2M')]
            elif division == 'キャリア科目P3M':
                classes = classes[classes['分類'].str.contains('P3M')]
        elif division == '講究科目':
            classes = classes[classes['科目区分'] == '講究科目']
            if course != 'all':
                classes = classes[classes['コース'] == course]
        elif division == '研究関連科目':
            classes = classes[classes['科目区分'] == '研究関連科目']
            if course != 'all':
                classes = classes[classes['コース'] == course]
        elif division == '専門科目':
            classes = classes[classes['科目区分'] == '専門科目']
            if course != 'all':
                classes = classes[classes['コース'] == course]
        elif division == 'コース標準学習課程外の専門科目又は研究関連科目':
            # print('コース標準学習課程外の専門科目又は研究関連科目')
            # print(pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
            df1 = self.pick_classes_of_division(classes, '専門科目', user, 'all')
            df2 = self.pick_classes_of_division(classes, '研究関連科目', user, 'all')
            # print('df1',pd.concat([df1['科目区分'],df1['科目コード'],df1['分類'],df1['単位数']],axis=1))
            # print('df2',pd.concat([df2['科目区分'],df2['科目コード'],df2['分類'],df2['単位数']],axis=1))
            classes = pd.concat([df1, df2]).drop_duplicates(subset='科目コード')
            # print('df3',pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
            standard_course_classes = pd.merge(self.pick_classes_of_division(
                classes, '専門科目', user, course), self.pick_classes_of_division(classes, '研究関連科目', user, course))
            #standard_course_classes = self.pick_classes_of_division(classes, '-', user, course)
            classes = classes[~classes['科目コード'].isin(
                standard_course_classes['科目コード'])]
            # print('df4',pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
        else:
            print(f'division error: {division}', file=sys.stderr)
            sys.exit(1)
        return classes

    def pick_classes_of_divisions(self, classes, divisions, user: User):
        #print('pick_classes_of_divisions', divisions)
        # print(classes)
        ret_df = pd.DataFrame(index=[], columns=class_columns)
        for division in divisions:
            tmp = self.pick_classes_of_division(
                classes, division, user, user.determine_course)
            if tmp is None:
                continue
            ret_df = pd.concat([ret_df, tmp])
        ret_df = ret_df.drop_duplicates(subset='科目コード')
        # print('df5',pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
        return ret_df

    def pick_classes_of_classification(self, classes, classification, user: User):
        if classification == '-':
            pass
        else:
            classes = classes[classes['分類'] == classification]
        return classes

    def pick_classes_of_classifications(self, classes, classifications, user: User):
        return pd.concat([self.pick_classes_of_classification(classes, classification, user) for classification in classifications]).drop_duplicates(subset='科目コード')

    def determine_requirement(self, requirement, user: User, classes):
        if requirement['要件'] == '指定':
            classes = classes[classes['科目コード'] == requirement['科目コード']]
            if len(classes) > 0:
                return True
            else:
                self.missing_requirements.append(pd.DataFrame([requirement]))
                return False
        elif requirement['要件'] == '単位数':
            divisions = list(requirement['科目区分'].split(','))
            classes = self.pick_classes_of_divisions(classes, divisions, user)
            classifications = list(requirement['分類'].split(','))
            classes = self.pick_classes_of_classifications(
                classes, classifications, user)
            if requirement['コース標準課程'] == '除く':
                standard_course_classes = self.pick_classes_of_division(
                    classes, '-', user, 'コース標準課程')
                classes = classes[~classes['科目コード'].isin(
                    standard_course_classes['科目コード'])]
            # print(pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
            # print(divisions,classifications,requirement,classes['単位数'].sum())
            if classes['単位数'].sum() >= requirement['数']:
                return True
            else:
                self.missing_requirements.append(pd.DataFrame([requirement]))
                return False
        elif requirement['要件'] == '群数':
            divisions = list(requirement['科目区分'].split(','))
            classes = self.pick_classes_of_divisions(classes, divisions, user)
            classifications = list(requirement['分類'].split(','))
            classes = self.pick_classes_of_classifications(
                classes, classifications, user)
            return len(classes['分類'].unique()) >= requirement['数']

            if len(classes['分類'].unique()) >= requirement['数']:
                return True
            else:
                # print(classes['分類'].unique())
                tmp = copy.deepcopy(requirement)
                tmp['群'] = ','.join(classes['分類'].unique().tolist())
                self.missing_requirements.append(pd.DataFrame([tmp]))
                return False

    def determine_user_course_(self, user: User, classes):
        # print('determine_user_course_')
        # print(classes)
        # print(pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
        self.requirements = self.rules_df[self.rules_df['コース']
                                          == user.determine_course]
        results = []
        for i, requirement in self.requirements.iterrows():
            result = self.determine_requirement(
                requirement, user, copy.deepcopy(classes))
            results.append(result)
        # print(all(results),results)
        self.user_results.append(results)
        return results

    def determine_user_course(self, user: User, codes=None, classes=None):
        if codes is None and classes is None:
            codes = copy.copy(user.class_codes)
            pd.DataFrame(index=[], columns=class_columns)
            self.user = user
            self.user_results = []
            self.missing_requirements = []
        #print('determine_user_course', codes, type(classes))
        # print(classes)
        if len(codes) == 0:
            # print(pd.concat([classes['科目区分'],classes['科目コード'],classes['分類'],classes['単位数']],axis=1))
            results = self.determine_user_course_(user, classes)
            return all(results)
        code = codes.pop()
        class_ = self.classes_df[self.classes_df['科目コード'] == code]
        if type(class_) is pd.core.series.Series:
            class_ = pd.DataFrame([class_])
        #if len(class_) > 1: print('multi', class_)
        for i, class_i in class_.iterrows():
            if type(class_i) is pd.core.series.Series:
                class_i = pd.DataFrame([class_i])
            classes_tmp = pd.concat([copy.deepcopy(classes), class_i])
            if type(classes) is pd.core.series.Series:
                classes_tmp = pd.DataFrame([classes_tmp])
            if self.determine_user_course(user, copy.copy(codes), classes_tmp):
                return True
        return False

    def recommend_class(self, user: User):
        ret = set()
        # print('1',self.requirements)
        # print('1',self.user_results)
        if len(self.missing_requirements) == 0:
            return
        self.missing_requirements = pd.concat(self.missing_requirements)
        if type(self.missing_requirements) is pd.core.series.Series:
            # print(self.missing_requirements)
            # print(type(self.missing_requirements))
            # print(pd.DataFrame([self.missing_requirements]))
            self.missing_requirements = pd.DataFrame(
                [self.missing_requirements])
        self.missing_requirements = self.missing_requirements.drop_duplicates()

        for i, missing_requirement in self.missing_requirements.iterrows():
            if missing_requirement['要件'] == '指定':
                ret.add(missing_requirement['科目コード'])
            elif missing_requirement['要件'] == '単位数':
                classes = copy.deepcopy(self.classes_df)
                divisions = list(missing_requirement['科目区分'].split(','))
                classes = self.pick_classes_of_divisions(
                    classes, divisions, user)
                classifications = list(missing_requirement['分類'].split(','))
                classes = self.pick_classes_of_classifications(
                    classes, classifications, user)
                if missing_requirement['コース標準課程'] == '除く':
                    standard_course_classes = self.pick_classes_of_division(
                        classes, '-', user, 'コース標準課程')
                    classes = classes[~classes['科目コード'].isin(
                        standard_course_classes['科目コード'])]
                ret |= set(classes['科目コード'].tolist())
            elif missing_requirement['要件'] == '群数':
                divisions = list(self.requirement['科目区分'].split(','))
                classes = self.pick_classes_of_divisions(
                    classes, divisions, user)
                classifications = set(list(self.requirement['分類'].split(
                    ','))) - set(list(self.requirement['群'].split(',')))
                classes = self.pick_classes_of_classifications(
                    classes, classifications, user)
                ret |= classes['科目コード']

        ret -= set(self.user.class_codes)
        return ret


def test1():
    user = User('情報工学コース修士課程', '情報工学コース修士課程',
                'LAH.S433,LAH.T420,LAH.S501,LAC.M401,LAC.M527,CSC.Z491,CSC.Z492,CSC.Z591,CSC.Z592,CSC.U481,CSC.U482,CSC.T421,CSC.T422,CSC.T426,ART.T458,XCO.T484,XCO.T473,XCO.T474,XCO.T478')

    determiner = Determiner()

    results = determiner.determine_user_course(user)
    print(results)
    return results

def test2() -> bool:
    test_df = pd.ExcelFile('tests.xlsx').parse('Sheet1')
    determiner = Determiner()
    ok: bool = True
    for i, test in test_df.iterrows():
        # print(test)
        # User(self, course, determine_course, class_codes)
        user = User(test['所属コース'], test['判定コース'], test['履修科目'])
        result: str = ""
        if not determiner.determine_user_course(user):
            recommend_class: set = determiner.recommend_class(user)
            if test['返り値'] in recommend_class:
                #print(i, result)
                result = 'YES'
            else:
                result = 'NO'
        else:
            if test['返り値'] == '〇':
                result = 'YES'

        if result != 'YES':
            ok = False
    return ok

def run_sample():
    print("Hello, world!")
    print(test1())
    print(test2())

def determine_user_course(course: str, determine_course: str, class_codes: str):
    user = User(course,determine_course,class_codes)
    determiner = Determiner()
    return determiner.determine_user_course(user)

if __name__ == "__main__":
    args = sys.argv
    if (len(args) == 4):
        print(determine_user_course(args[1], args[2], args[3]))
    else:
        run_sample()
    

